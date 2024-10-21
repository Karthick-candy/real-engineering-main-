import React, { useEffect } from "react";
import ReactModal from 'react-modal';
import '../styles/Popup.css';

ReactModal.setAppElement('#root');

const Popuppage = ({ isOpen, onRequestClose, content, onConfirm }) => {
  useEffect(() => {
    // Automatically close the popup after 3 seconds if it's a success message
    if (content === "Service request raised successfully. We will get back to you soon! Thank you!!") {
      const timer = setTimeout(() => {
        onRequestClose();
      }, 3000);
      return () => clearTimeout(timer); // Cleanup timer on component unmount
    }
  }, [content, onRequestClose]);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Service Request Status"
      className="popup"
      overlayClassName="popup-overlay"
    >
      <div className="popup-content">
        <p>{content}</p>
        {content === "Please confirm that you have sent the WhatsApp message." ? (
          <button onClick={onConfirm} className="popup-confirm-btn">Confirm</button>
        ) : null }
      </div>
    </ReactModal>
  );
};

export default Popuppage;
