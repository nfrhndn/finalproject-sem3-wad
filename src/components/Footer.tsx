const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-6 mt-10">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
                <p>&copy; 2025 CinemaPlus. All rights reserved.</p>
                <div className="flex space-x-4 mt-3 md:mt-0">
                    <a href="#" className="hover:text-white">
                        Tentang Kami
                    </a>
                    <a href="#" className="hover:text-white">
                        Kebijakan Privasi
                    </a>
                    <a href="#" className="hover:text-white">
                        Bantuan
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
