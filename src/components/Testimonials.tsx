const testimonials = [
    {
        id: 1,
        desc: "improved my productivity and focus. trackit is a game changer!",
        name: "serena",
    },
    {
        id: 2,
        desc: "ok this shit is fire. I love how easy it is to track my habits.",
        name: "kordell"
    },
    {
        id: 3,
        desc: "eatsssss!!",
        name: "jana"
    },
    {
        id: 4,
        desc: "trackit helps me stay on top of my day..",
        name: "belledasha"
    },
    {
        id: 5,
        desc: "trackit def helps with my country work lol, iykyk..",
        name: "olandria"
    },

]

const Testimonials = () => {
  return (
    <section className="mb-20">
        <h1 className="text-2xl font-bold mb-5 text-center md:text-4xl">what people are saying</h1>
        <div className="grid md:grid-cols-3 place-items-center">{testimonials.map(test => (
            <div key={test.id} className="bg-secondary p-4 rounded-lg mb-4 w-10/12 flex flex-col justify-between h-40">
                <p className="text-xl">"{test.desc}"</p>
                <p>@{test.name}</p>
            </div>
        ))}</div>
    </section>
  )
}

export default Testimonials