import { useFormStatus } from "react-dom";

type SubmitButton = {
  text: string;
  valid: boolean;
};

export default function SubmitButton({ valid, text }: SubmitButton) {
  const { pending } = useFormStatus();
  const isDisabled = () => {
    return !valid;
  };

  return (
    <>
      {isDisabled() ? (
        <div className="bg-black w-full">
          <button
            type="submit"
            className="text-center bg-green-50 text-gray-200 p-2 w-full border-2 border-solid border-black"
            disabled
          >
            {text}
          </button>
        </div>
      ) : (
        <div className="bg-black w-full">
          <button
            type="submit"
            className="text-center bg-green-200 text-black p-2 w-full border-2 border-solid border-black hover:translate-x-[-5px] hover:translate-y-[-5px] hover:transition-all transition-all active:translate-x-0 active:translate-y-0 active:transition-all active:duration-75"
          >
            {pending ? "Loading..." : text}
          </button>
        </div>
      )}
    </>
  );
}
