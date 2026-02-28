export const siteConfig = {
  name: "FrankenSQLite",
  title: "FrankenSQLite — The Monster Database Engine for Rust",
  description:
    "A clean-room Rust reimplementation of SQLite with MVCC concurrency, RaptorQ self-healing, and zero unsafe code. 26-crate workspace delivering the monster database engine.",
  url: "https://frankensqlite.com",
  github: "https://github.com/Dicklesworthstone/frankensqlite",
  social: {
    github: "https://github.com/Dicklesworthstone/frankensqlite",
    x: "https://x.com/doodlestein",
    authorGithub: "https://github.com/Dicklesworthstone",
  },
} as const;

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/showcase", label: "Showcase" },
  { href: "/architecture", label: "Architecture" },
  { href: "/spec_evolution", label: "Spec Evolution" },
  { href: "/getting-started", label: "Get Started" },
] as const;
