import { Link } from "react-router";
import { Github } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";

const IntroductionPage = () => {
  const { authUser } = useAuthStore();
  return (
    <div className="relative h-screen overflow-hidden bg-black text-white flex flex-col">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.06),transparent_35%)]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(120deg,transparent_0,transparent_90px,rgba(255,255,255,0.09)_120px,transparent_170px)] blur-2xl" />
      </div>

      <header className="relative z-10 flex w-full items-center justify-between px-4 md:px-8 lg:px-12 pt-5 text-sm text-gray-200">
        <div className="text-3xl font-semibold tracking-tight text-white">EchoSpace</div>
        <div />
        <div className="flex items-center gap-5">
          {authUser ? (
            <Link
              to="/chat"
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 hover:border-white transition-colors"
            >
              {authUser.profilePic ? (
                <img
                  src={authUser.profilePic}
                  alt={authUser.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-zinc-700 flex items-center justify-center text-white font-semibold">
                  {authUser.fullName?.charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
          ) : (
            <>
              <Link to="/login" className="hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/signup" className="hover:text-white transition-colors">
                Signup
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-full max-w-4xl space-y-4">
          <h1 className="text-5xl italic font-light leading-tight md:text-7xl">
            Conversations without distance.
          </h1>
          <p className="mx-auto max-w-3xl text-sm font-light text-gray-300 md:text-xl">
            EchoSpace is built for spontaneous conversations, new connections, and moments shared instantly across the
            world.
          </p>
          <div className="pt-2">
            <Link
              to="/chat"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-zinc-700/40 px-12 py-4 text-xl font-medium text-white backdrop-blur-sm transition-all hover:bg-zinc-500/50"
            >
              Continue
            </Link>
          </div>
        </div>

        <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-xs text-gray-400">
          <p className="mb-1">made with ♡ by</p>
          <a href="https://github.com/Marwan-Qasim" target="_blank" rel="noreferrer" className="inline-flex hover:text-white">
            <Github className="h-4 w-4" />
          </a>
        </footer>
      </main>
    </div>
  );
};

export default IntroductionPage;
