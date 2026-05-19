FROM gcc:latest

WORKDIR /app

COPY runner.sh .

RUN sed -i 's/\r$//' runner.sh

RUN chmod +x runner.sh

CMD ["sh", "runner.sh"]