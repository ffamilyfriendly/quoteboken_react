import CreateUser from "./CreateUser";
import UserList from "./UserList";

export default function UserManager() {
    return (
        <main>
            <h1>Users</h1>
            <UserList />
            <CreateUser />
        </main>
    )
}