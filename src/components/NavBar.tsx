

const NavBar = () => {
  return (
    <header className="flex justify-between items-center p-6">
        <h1 className="text-4xl font-extrabold">trackit</h1>
        <div>
            <button>login</button>
            <button>signup</button>
        </div>
    </header>
  )
}

export default NavBar