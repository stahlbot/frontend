import ClientRow from "./ClientRow";
import { useSelector } from "react-redux";
import {
  deleteClient,
  fetchClients,
  selectClientIds,
  selectClientIdsSortedBy,
} from "./clientsSlice";
import { useAppDispatch } from "../../app/hooks";
import { useEffect, useState } from "react";
import PowerTable from "../tables/PowerTable";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import AddClientForm from "./AddClientForm";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../app/store";

const ClientsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState<string>("name");
  const [opened, { open, close }] = useDisclosure(false);
  const [clientEdited, setClientEdited] = useState<string>("");

  const clients = useSelector((state) =>
    selectClientIdsSortedBy(state, sortBy)
  );
  const clientsStatus = useSelector<RootState, string>(
    (state) => state.clients.status
  );

  useEffect(() => {
    if (clientsStatus === "idle") {
      dispatch(fetchClients());
    }
  }, [dispatch, clientsStatus]);

  const columns = [
    { accessorkey: "name", header: "Name" },
    { accessorkey: "number", header: "Number" },
    { accessorkey: "createdAt", header: "Created At" },
    { accessorkey: "clerk", header: "Clerk" },
  ];

  const onDelete = async (id) => {
    await dispatch(deleteClient(id)).unwrap();
  };

  const onOpen = (id) => {
    navigate(`/clients/${id}`);
  };

  const onEdit = (id) => {
    setClientEdited(id);
    open();
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Add Client">
        <AddClientForm close={close} clientId={clientEdited} />
      </Modal>
      <PowerTable
        columns={columns}
        RowTemplate={ClientRow}
        data={clients}
        onDelete={onDelete}
        onAdd={() => {
          setClientEdited("");
          open();
        }}
        onOpen={onOpen}
        onEdit={onEdit}
        setSortBy={setSortBy}
        sortBy={sortBy}
      ></PowerTable>
    </>
  );
};

export default ClientsPage;
