const Spinner = () => {
    return (
        <div>
            <div className="h-screen w-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        </div>
    );
};

export default Spinner;