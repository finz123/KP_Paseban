export default function ClockAnimation() {
    return (
      <div className="relative h-16 w-16 flex items-center justify-center bg-gray-200 rounded-full shadow-lg">
        {/* Lingkaran Luar */}
        <div
          className="absolute h-full w-full border-2 border-indigo-600 rounded-full"
          style={{
            animation: "spin-slow 10s linear infinite",
          }}
        ></div>
  
        {/* Jarum Detik */}
        <div
          className="absolute h-6 w-1 bg-red-500 origin-bottom"
          style={{
            animation: "spin-fast 1s linear infinite",
          }}
        ></div>
  
        {/* Jarum Menit */}
        <div
          className="absolute h-5 w-1 bg-gray-700 origin-bottom"
          style={{
            animation: "spin-medium 60s linear infinite",
          }}
        ></div>
  
        <style jsx>{`
          @keyframes spin-slow {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
  
          @keyframes spin-medium {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
  
          @keyframes spin-fast {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }
  