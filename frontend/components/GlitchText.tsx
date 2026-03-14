export function GlitchText({ text }: { text: string }) {
  return (
    <h1 className="text-4xl md:text-6xl glitch font-techno text-neon-purple">
      {text}
    </h1>
  )
}
