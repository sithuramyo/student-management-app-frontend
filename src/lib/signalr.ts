import * as signalR from "@microsoft/signalr";
import Cookies from "js-cookie";

let connection: signalR.HubConnection | null = null;

export const createSignalRConnection = () => {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5000/chatHub", {
        withCredentials: true,
        accessTokenFactory: async () => {
          const token = Cookies.get("authToken");
          return token || "";
        },
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
  }

  return connection;
};
