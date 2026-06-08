"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { useDisclosure } from "@heroui/modal";
import { signOut } from "next-auth/react";
import { LogoutCurve } from "iconsax-react";

export default function LogoutButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  async function handleLogout() {
    onClose();
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className="flex items-center px-4 gap-5"
      >
        <LogoutCurve color="#E62020" size={20} />
        <span className="text-red">Logout</span>
      </button>

      <Modal isOpen={isOpen} onClose={onClose} placement="center" size="sm">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Confirm Logout
          </ModalHeader>

          <ModalBody>
            <p className="text-sm text-gray-600">
              Are you sure you want to logout? You will need to sign in again to access your account.
            </p>
          </ModalBody>

          <ModalFooter>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
