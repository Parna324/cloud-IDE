function Terminal({ output }) {
  return (
    <div className="h-56 bg-black border-t border-white/10 p-4 overflow-auto">
      <h2 className="text-green-400 font-bold mb-4">Terminal</h2>

      <pre className="text-gray-300 whitespace-pre-wrap">{output}</pre>
    </div>
  );
}

export default Terminal;
