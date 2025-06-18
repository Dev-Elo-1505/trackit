import { Link } from "react-router-dom"


const Hero = () => {
  return (
    <section className="mt-10 mb-20">
      <h1 className="font-semibold text-3xl lg:text-6xl mb-1">your smart habit tracker.</h1>
      <h2 className="font-semibold text-3xl mb-2 lg:text-6xl">track habits with <span className="font-extrabold">trackit</span>.</h2>
      <p className="font-medium mb-4">your smart habit tracker that helps you build and maintain good habits.</p>
      <button className="btn mb-4 bg-primary hover:bg-[#ffd23e]"> <Link to="/auth/signup" >start tracking — it's free</Link></button>
     
      <p className="text-darkText text-sm">will be loved by 1M+ cool people</p>
    </section>
  )
}

export default Hero