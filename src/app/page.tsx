import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-screen bg-gray-100">
      <div className="flex flex-col justify-center items-center h-full w-full">
        <h1 className="text-[32px] font-semibold mb-5">🗿💊💉</h1>
        <Link href={"/login"}>
          <button className="w-[400px] text-center bg-black text-white mb-5 p-2 rounded-md">
            Login page
          </button>
        </Link>
        <Link href={"/register"}>
          <button className="w-[400px] text-center bg-black text-white mb-5 p-2 rounded-md">
            Register page
          </button>
        </Link>
        <h1 className="text-md font-semibold mb-5">Open Apotek v0.1</h1>
      </div>
    </div>
  );
}
