import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const path = __dirname + "/../todo.proto";
const proto = protoLoader.loadSync(path);
const TodoServer = grpc.loadPackageDefinition(proto);

const client = new (TodoServer.TodoService as grpc.ServiceClientConstructor)(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

function exec() {
  client.list({}, (error: grpc.ServiceError, response: any) => {
    if (error) throw error;
    console.log(response);
  });
  client.insert(
    { task: "Estudar" },
    (error: grpc.ServiceError, response: any) => {
      if (error) throw error;
      console.log(response);
    }
  );
  client.list({}, (error: grpc.ServiceError, response: any) => {
    if (error) throw error;
    console.log(response);
  });
  client.mark({ id: 3 }, (error: grpc.ServiceError, response: any) => {
    if (error) throw error;
    console.log(response);
  });
  client.list({}, (error: grpc.ServiceError, response: any) => {
    if (error) throw error;
    console.log(response);
  });
}
exec();
