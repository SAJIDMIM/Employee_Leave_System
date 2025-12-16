import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex flex-col items-center justify-center">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="mt-8 text-2xl font-semibold text-gray-800">
          Edit <code className="bg-gray-200 px-2 py-1 rounded font-mono">src/App.js</code> and save to reload.
        </p>
        <a
          className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-200"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div className="mt-10 p-6 bg-white rounded-xl shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-green-600 mb-2">
            ✓ Tailwind CSS v3 is Working!
          </h2>
          <p className="text-gray-600">
            If you see this green text and styled components, Tailwind is properly configured.
          </p>
          <div className="mt-4 flex gap-2 justify-center">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Tailwind</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">React</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">CSS</span>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;