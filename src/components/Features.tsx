
const features = [
    {
        id: 1,
        title: "create, track, repeat",
        desc: "build habits your way — daily, weekly, whatever works for you."
    },
    {
        id: 2,
        title: "consistency-first philosophy",
        desc: "built to help you show up, not burn out. This isn't hustle culture, it's real-life rhythm."
    },
    {
        id: 3,
        title: "progress at a glance",
        desc: "your journey, visualized. Streaks, skips, and all — no judgment."
    },
    {
        id: 4,
        title: "smart habit logging",
        desc: "one-click and done. log your wins without jumping through hoops."
    },
    {
        title: "smart coach insights",
        desc: "data-driven motivation and personalized tips to keep you on track."
    },
    {
        id: 6,
        title: "no shame skips",
        desc: "missed a day? no red crosses, just white space. because life happens."
    },
]
const Features = () => {
  return (
    <section className="mb-20">
        <h1 className="text-2xl font-bold mb-5 text-center md:text-4xl">all the good stuff</h1>
        <div>{features.map(feat => (
            <div key={feat.id} className="bg-secondary p-5 rounded-lg mb-4">
                <h2 className="text-xl font-semibold">{feat.title}</h2>
                <p>{feat.desc}</p>
            </div>
        ))}</div>
    </section>
  )
}

export default Features