// ScrollImages.js
// import React, { useState, useEffect } from 'react';
// import './ScrollImages.css'; // Import CSS for styling the images

// const ScrollImages = () => {
//     const [scrollY, setScrollY] = useState(0);

//     useEffect(() => {
//         const handleScroll = () => {
//             setScrollY(window.scrollY);
//         };

//         window.addEventListener('scroll', handleScroll);

//         return () => {
//             window.removeEventListener('scroll', handleScroll);
//         };
//     }, []);

//     return (
//         <div className="scroll-images-container">
//             <div
//                 className="image-group"
//                 style={{
//                     transform: `translateX(${scrollY * 0.1}px)`, // Modify this multiplier to adjust movement speed
//                 }}
//             >
//                 <img src="overheadtress.jpg" alt="Image 1" className="image" />
//                 <img src="greenforest.jpg" alt="Image 2" className="image" />
//             </div>
//         </div>
//     );
// };

// export default ScrollImages;
