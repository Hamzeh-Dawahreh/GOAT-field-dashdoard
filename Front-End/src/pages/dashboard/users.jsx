import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
  Button,
  IconButton
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Link } from 'react-router-dom';

export function Users() {


  // ! get users data
  const [usersData, setUsersData] = useState([]);
  useEffect(() => {
    // Make an API call to fetch users data
    axios.get('http://localhost:8181/usersData')
      .then(response => {
        // Update the usersData state with the received data
        setUsersData(response.data);
      })
      .catch(error => {
        console.error('Error fetching users data:', error);
      });
  }, []);







  return (
    <div className="mt-12 mb-8 flex flex-col gap-12 ">
      <Card>
        <CardHeader variant="gradient" acolor="green" className="mb-8 p-6">
          <div className="grid grid-cols-6 gap-x-8 justify-end">
            <Typography variant="h6" color="white">
              Users Table
            </Typography>
            <Typography
              as="a"
              href='Users/add'
              className="text-xs font-semibold text-blue-gray-600 justify-center"
            >
              <Button color="blue-gray" size="sm">
                Add User
              </Button>
            </Typography>
          </div>
        </CardHeader>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["id", "Name", "Email", "Role", "Action"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usersData.map(({ user_id, user_name, user_email, role }, key) => {
                const className = `py-3 px-5 ${key === usersData.length - 1 ? "" : "border-b border-blue-gray-50"
                  }`;

                return (
                  <tr key={user_id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <div>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {user_id}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {user_name}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {user_email}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {role}
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="grid grid-cols-2 gap-2 justify-center">
                        <div className="justify-center">
                          <Typography
                            as="a"
                            href={'Users/edit/' + user_id}
                            className="text-xs font-semibold text-blue-gray-600 justify-center"
                          >
                            <IconButton ripple={true} color="green">
                              <i className="fa-regular fa-pen-to-square"></i>
                            </IconButton>
                          </Typography>
                        </div>
                        <div className="justify-center">
                          <Typography
                            as="a"
                            href={'Users/delete/' + user_id}
                            className="text-xs font-semibold text-blue-gray-600 justify-center"
                          >
                            <IconButton ripple={true} color="green">
                              <i className="fa-solid fa-trash"></i>
                            </IconButton>
                          </Typography>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Users;
