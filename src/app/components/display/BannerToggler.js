import { useState, useEffect, useRef } from 'react';
import DoctorCuti from '../display/DoctorCuti';
import DoctorPraktek from '../display/DoctorPraktek';

const BannerToggler = () => {
  const [showDoctorCuti, setShowDoctorCuti] = useState(true);
  const tableRef = useRef(null);

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (tableRef.current) {
        tableRef.current.scrollBy({
          top: 1,
          behavior: 'smooth',
        });

        // Check if reached the bottom
        if (
          tableRef.current.scrollTop + tableRef.current.clientHeight >=
          tableRef.current.scrollHeight
        ) {
          setShowDoctorCuti(prev => !prev); // Toggle between DoctorCuti and DoctorPraktek
          setTimeout(() => {
            tableRef.current.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll back to top
          }, 1000); // Wait 1 second before scrolling back
        }
      }
    }, 50); // Scroll every 50ms

    return () => clearInterval(scrollInterval); // Clean up on unmount
  }, []);

  return (
    <div ref={tableRef} className="overflow-y-auto max-h-60 transition-opacity duration-500 ease-in-out">
      {showDoctorCuti ? <DoctorCuti /> : <DoctorPraktek />}
    </div>
  );
};

export default BannerToggler;
