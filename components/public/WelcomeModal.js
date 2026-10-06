import { Modal, ModalHeader, ModalBody, Button, ModalFooter } from 'reactstrap';

const WelcomeModal = () => {
  return (
    <div>
      <Modal isOpen={true} size="lg">
        <ModalHeader>Welcome</ModalHeader>
        <ModalBody>
          <p>{`Welcome to MART, a sample retail demo application built on top of NCR's APIs.`}</p>
          <p>
            In order to get this application up and running, data is key. There are two options to start - create your own or import an example database. Creating your own will take you to the admin
            dashboard where you can start with Sites, then add Categories, and finally add Catalog items. If you prefer to see the application in action first, import the example database.
          </p>
        </ModalBody>
        <ModalFooter>
          <a href="/admin/sites" className="btn btn-outline-primary">
            Start from Scratch
          </a>
          <Button color="primary">Import Database</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default WelcomeModal;
