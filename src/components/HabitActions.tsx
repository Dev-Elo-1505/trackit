import { GoTrash, GoPencil } from "react-icons/go";


interface HabitActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const HabitActions = ({ onEdit, onDelete }: HabitActionsProps) => {
  return (
    <div className="flex gap-4 items-center justify-center bg-white absolute top-1 left-0 w-full">
      <button onClick={onEdit} title="Edit Habit">
        <GoPencil className="text-lg cursor-pointer" />
      </button>
      <button onClick={onDelete} title="Delete Habit">
        <GoTrash className="text-lg cursor-pointer" />
      </button>
    </div>
  );
};

export default HabitActions;
