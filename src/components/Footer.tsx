const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row gap-6 md:gap-0 justify-between items-center md:items-start border-t border-gray-300 p-4 text-gray-700 text-center md:text-left">
      
      <div>
        <h4 className="font-semibold text-xl">trackit</h4>
      </div>
      <div>
        <h4 className="font-semibold text-xl">socials</h4>
        <ul>
          <li><a href="https://elooghene.vercel.app/" target="_blank">website</a></li>
          <li><a href="https://x.com/Elooghene__" target="_blank">x (twitter)</a></li>
          <li><a href="https://www.linkedin.com/in/addisijoy/" target="_blank">linkedin</a></li>
        </ul>
      </div>
      <div className="font-semibold">
        <p>© 2025 trackit inc</p>
        <p>by elooghene</p>
      </div>
    </footer>
  );
};

export default Footer;
