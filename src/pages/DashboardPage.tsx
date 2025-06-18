import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaPlus } from "react-icons/fa6";
import Modal from "../components/Modal";

const DashboardPage = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <section className="mt-10">
      <h1 className="font-medium text-2xl mb-5">
        welcome, {user?.displayName} !
      </h1>
      <button
        className="btn bg-primary hover:bg-[#ffd23e] text-text flex items-center gap-1"
        onClick={openModal}
      >
        <FaPlus />
        add habit
      </button>
      <Modal isOpen={showModal} onClose={closeModal}>
        <h2>start tracking a new habit</h2>
        <form>
          <div className="mt-7">
            <label htmlFor="habit" className="font-semibold">
              habit
            </label>
            <input
              type="text"
              name="habit"
              id="habit"
              className="border border-light rounded w-full px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700"
              placeholder="e.g work out"
            />
          </div>
          <div className="mt-7">
            <label htmlFor="goal" className="font-semibold">
              goal (in days)
            </label>
            <input
              type="numbers"
              name="goal"
              id="goal"
              className="border border-light rounded w-full px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-gray-700"
              placeholder="e.g 10"
            />
          </div>
          <button
        className="btn bg-primary hover:bg-[#ffd23e] text-text mt-4"
        
      >Save</button>
        </form>
      </Modal>
    </section>
  );
};

export default DashboardPage;
