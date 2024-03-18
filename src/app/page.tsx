export default function Home() {
  return (
    <div className="h-[100vh] bg-gradient-to-r from-[#C1DCC6] to-[#E1F0E6]">
      <div className="flex justify-center items-center h-full w-full">
        <div className="flex flex-col justify-center items-center w-1/2 h-3/4 rounded-xl shadow-md bg-[#FBFFFB]">
          <form action="">
            <label htmlFor="username" className="block">
              username
            </label>
            <input
              type="text"
              name="username"
              className="border border-gray-300 rounded-md"
            />
            <label htmlFor="username" className="block">
              password
            </label>
            <input
              type="password"
              name="password"
              className="border border-gray-300 rounded-md"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
