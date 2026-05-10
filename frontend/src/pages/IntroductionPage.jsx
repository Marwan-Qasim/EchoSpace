import { Link } from "react-router";
import { MessageCircle } from "lucide-react";

const IntroductionPage = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="flex items-center justify-between p-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          <span className="text-lg font-semibold">EchoSpace</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn btn-ghost btn-sm text-white">
            Login
          </Link>
          <Link to="/signup" className="btn btn-outline btn-sm text-white border-white hover:bg-white hover:text-black">
            Sign Up
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="mb-8">
          <MessageCircle className="w-20 h-20 mx-auto mb-6 text-white" />
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            EchoSpace
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-md mx-auto mb-8">
            Real-time messaging. Minimal. Private.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/signup" className="btn btn-lg bg-white text-black hover:bg-gray-200 border-none px-10">
            Get Started
          </Link>
          <Link to="/login" className="btn btn-lg btn-outline text-white border-white hover:bg-white hover:text-black px-10">
            Login
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full text-left">
          <div className="border border-gray-800 rounded-lg p-5">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="text-white font-semibold mb-1">Real-time</h3>
            <p className="text-gray-400 text-sm">Instant messaging powered by Socket.io</p>
          </div>
          <div className="border border-gray-800 rounded-lg p-5">
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="text-white font-semibold mb-1">Private</h3>
            <p className="text-gray-400 text-sm">End-to-end encrypted conversations</p>
          </div>
          <div className="border border-gray-800 rounded-lg p-5">
            <div className="text-2xl mb-2">🎨</div>
            <h3 className="text-white font-semibold mb-1">Minimal</h3>
            <p className="text-gray-400 text-sm">Clean, distraction-free interface</p>
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} EchoSpace. All rights reserved.
      </footer>
    </div>
  );
};

export default IntroductionPage;
