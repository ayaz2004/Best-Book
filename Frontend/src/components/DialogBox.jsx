import Reactm,{useState} from 'react'
import { HiOutlineExclamationCircle } from "react-icons/hi";

import { Alert, Button, Card, Modal, TextInput } from "flowbite-react";
export const DialogBox = ({handleAction,show}) => {
const [showModal, setShowModal] = useState(show);

const handleClick = () => {
    handleAction();
}
  return (
    <div>
        {/* Modal for Delete Confirmation */}
        <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleAction}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}


