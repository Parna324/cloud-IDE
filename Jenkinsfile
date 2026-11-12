pipeline {
  agent any

  parameters {
    booleanParam(name: 'DEPLOY_TO_K8S', defaultValue: false, description: 'Deploy built images to Kubernetes after a successful main-branch build')
    string(name: 'REGISTRY', defaultValue: 'ghcr.io', description: 'Container registry host')
    string(name: 'IMAGE_NAMESPACE', defaultValue: 'parna324/cloud-ide', description: 'Registry namespace for application images')
    string(name: 'IMAGE_TAG', defaultValue: '', description: 'Image tag to publish. Leave blank to use the build number.')
    string(name: 'KUBE_CONTEXT', defaultValue: '', description: 'Optional kube context name to use for deployment')
  }

  environment {
    NODE_VERSION = '20'
    RUNNER_IMAGE_PREFIX = ''
    RUNNER_IMAGE_TAG = ''
  }

  stages {
    stage('Prepare') {
      steps {
        checkout scm
        script {
          env.RESOLVED_IMAGE_TAG = params.IMAGE_TAG?.trim() ? params.IMAGE_TAG.trim() : env.BUILD_NUMBER
        }
      }
    }

    stage('Validate') {
      parallel {
        stage('Frontend') {
          steps {
            dir('apps/frontend') {
              sh '''#!/usr/bin/env bash
set -euo pipefail
npm ci
npm run lint
npm run build
'''
            }
          }
        }

        stage('Auth Service') {
          steps {
            dir('services/auth-service') {
              withEnv(['DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cloudide']) {
                sh '''#!/usr/bin/env bash
set -euo pipefail
npm ci
npx prisma generate
node --check src/index.js
'''
              }
            }
          }
        }

        stage('Gateway') {
          steps {
            dir('services/gateway') {
              sh '''#!/usr/bin/env bash
set -euo pipefail
npm ci
node --check src/index.js
'''
            }
          }
        }

        stage('Execution Engine') {
          steps {
            dir('services/execution-engine') {
              sh '''#!/usr/bin/env bash
set -euo pipefail
npm ci
node --check src/index.js
node --check src/socket.js
'''
            }
          }
        }
      }
    }

    stage('Build Images') {
      steps {
        script {
          def pushImages = env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'origin/main'
          def imagePrefix = "${params.REGISTRY}/${params.IMAGE_NAMESPACE}"
          def imageTag = env.RESOLVED_IMAGE_TAG
          def pushFlag = pushImages ? '--push' : '--load'

          sh "docker buildx create --use --name cloud-ide-builder >/dev/null 2>&1 || docker buildx use cloud-ide-builder"

          def builds = [
            [name: 'frontend', context: 'apps/frontend', args: '--build-arg VITE_API_BASE_URL=/api'],
            [name: 'gateway', context: 'services/gateway', args: ''],
            [name: 'auth-service', context: 'services/auth-service', args: ''],
            [name: 'execution-engine', context: 'services/execution-engine', args: ''],
            [name: 'runner-python', context: 'services/execution-engine/docker/python', args: ''],
            [name: 'runner-javascript', context: 'services/execution-engine/docker/javascript', args: ''],
            [name: 'runner-cpp', context: 'services/execution-engine/docker/cpp', args: ''],
            [name: 'runner-java', context: 'services/execution-engine/docker/java', args: '']
          ]

          for (build in builds) {
            def extraArgs = build.args?.trim() ? "${build.args} " : ''
            sh "docker buildx build ${pushFlag} -t ${imagePrefix}/${build.name}:${imageTag} ${extraArgs}${build.context}"
          }
        }
      }
    }

    stage('Deploy') {
      when {
        allOf {
          branch 'main'
          expression { return params.DEPLOY_TO_K8S }
        }
      }

      steps {
        script {
          def imagePrefix = "${params.REGISTRY}/${params.IMAGE_NAMESPACE}"
          def imageTag = env.RESOLVED_IMAGE_TAG

          if (params.KUBE_CONTEXT?.trim()) {
            sh "kubectl config use-context ${params.KUBE_CONTEXT.trim()}"
          }

          sh '''#!/usr/bin/env bash
set -euo pipefail
kubectl apply -f k8s/
'''

          sh "kubectl set image deployment/frontend frontend=${imagePrefix}/frontend:${imageTag}"
          sh "kubectl set image deployment/gateway gateway=${imagePrefix}/gateway:${imageTag}"
          sh "kubectl set image deployment/auth-service auth-service=${imagePrefix}/auth-service:${imageTag}"
          sh "kubectl set image deployment/execution-engine execution-engine=${imagePrefix}/execution-engine:${imageTag}"
          sh "kubectl set env deployment/execution-engine RUNNER_IMAGE_PREFIX=${imagePrefix} RUNNER_IMAGE_TAG=${imageTag}"
        }
      }
    }
  }

  post {
    always {
      cleanWs(deleteDirs: true, disableDeferredWipeout: true)
    }
  }
}