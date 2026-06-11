/* Bundlers (Vite, Next, webpack) statically replace process.env.NODE_ENV in
   library code; this declaration keeps the package free of @types/node. */
declare const process: { env: { NODE_ENV?: string } };
