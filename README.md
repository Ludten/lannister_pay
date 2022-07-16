# LannisterPay (TPSS)
LannisterPay is a transaction payment splitting service meant to calculate the amount due to one or more split payment "entities" as well as the amount left after all splits have been computed.

### Prerequisite
1. The depends on the Node Package Manager (NPM). You will need to download and install Node from [https://nodejs.com/en/download](https://nodejs.org/en/download/). This will allow you to be able to run `npm` commands.

### API
Launch the API locally.

* To download all the package dependencies, run the command from the directory `lannisterpay-api/`:
    ```bash
    npm install .
    ```
* To run the application locally, run:
    ```bash
    npm run dev
    ```
* You can visit `http://localhost:3000` in your web browser to verify that the application is running.

* you can also visit `http://localhost:3000/split-payments/compute` to POST your entity requests. You should see a JSON payload. Feel free to play around with Postman to test the API.

### Sample Entry
```
{
    "ID": 13092,
    "Amount": 4500,
    "Currency": "NGN",
    "CustomerEmail": "anon8@customers.io",
    "SplitInfo": [
        {
            "SplitType": "FLAT",
            "SplitValue": 450,
            "SplitEntityId": "LNPYACC0019"
        },
        {
            "SplitType": "RATIO",
            "SplitValue": 3,
            "SplitEntityId": "LNPYACC0011"
        },
        {
            "SplitType": "PERCENTAGE",
            "SplitValue": 3,
            "SplitEntityId": "LNPYACC0015"
        },
        {
            "SplitType": "RATIO",
            "SplitValue": 2,
            "SplitEntityId": "LNPYACC0016"
        },
        {
            "SplitType": "FLAT",
            "SplitValue": 2450,
            "SplitEntityId": "LNPYACC0029"
        },
        {
            "SplitType": "PERCENTAGE",
            "SplitValue": 10,
            "SplitEntityId": "LNPYACC0215"
        }
    ]
}
```

#### Output
```
{
    "ID": 13092,
    "Balance": 0,
    "SplitBreakdown": [
        {
            "SplitEntityId": "LNPYACC0019",
            "Amount": 450
        },
        {
            "SplitEntityId": "LNPYACC0011",
            "Amount": 2450
        },
        {
            "SplitEntityId": "LNPYACC0015",
            "Amount": 48
        },
        {
            "SplitEntityId": "LNPYACC0215",
            "Amount": 155.2
        },
        {
            "SplitEntityId": "LNPYACC0011",
            "Amount": 838.08
        },
        {
            "SplitEntityId": "LNPYACC0016",
            "Amount": 558.72
        }

    ]
}
```
