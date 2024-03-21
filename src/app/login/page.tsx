export default function Login() {
  return (
    <div className="h-[100vh] bg-gray-100">
      <div className="flex flex-col justify-center items-center h-full w-full">
        <h1 className='text-[32px] font-semibold mb-5'>Selamat datang</h1>
        <div className="flex flex-col justify-center items-center w-[400px] mb-5 p-10 rounded-xl bg-white border border-gray-400">
          <form action="" className="w-full">
            <div className="mb-5">
              <label htmlFor="username" className="block text-sm mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                className="w-full h-8 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="username" className="block text-sm mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="w-full h-8 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="text-center bg-black text-white p-2 w-full rounded-md"
            >
              Masuk
            </button>
          </form>
        </div>
        <h1 className='text-md font-semibold mb-5'>Open Apotek v0.1</h1>
      </div>
    </div>
  );
}