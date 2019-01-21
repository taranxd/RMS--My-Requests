# Demo: SPFX Webparts for Request Management System

SPFx project with a  client-side web parts that uses React, [Fabric React](https://developer.microsoft.com/fabric) and the Batch command in PnpJS to currently logged in user's raised requests in a familiar office list. One REST call is made to fetch requests from various lists storing the requests. 
Displaying is handled in React State component which makes the page responsive and intuitive and displays results as soon as they're processed and don't wait for the entire result set processing.

## Running the demo

1. Open a command prompt and change directory to the root of the application.
1. Execute the following command to download all necessary dependencies

    ```shell
    npm install
    ```

1. Create the SharePoint package for deployment:
    1. Build the solution by executing the following on the command line:

        ```shell
        gulp build
        ```

    1. Bundle the solution by executing the following on the command line:

        ```shell
        gulp bundle --ship
        ```

    1. Package the solution by executing the following on the command line:

        ```shell
        gulp package-solution --ship
        ```
