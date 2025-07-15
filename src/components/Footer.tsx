const Footer = () => {
  return (
    <footer className="flex justify-between border-t border-gray-300 p-4 text-gray-700">
      
      <div>
        <h4 className="font-semibold text-xl">trackit</h4>
      </div>
      <div>
        <h4 className="font-semibold text-xl">socials</h4>
        <ul>
          <li><a href="https://elooghene.vercel.app/" target="_blank">website</a></li>
          <li><a href="https://x.com/Elooghene__" target="_blank">x (twitter)</a></li>
          <li>linkedin</li>
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
