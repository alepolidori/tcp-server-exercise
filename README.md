# TCP Servers

This Git repository contains all the four steps of the home assignment.

- `src` directory contains the source code: one file for each step
- `.github/wrokflows`: contains the GitHub actions to deploy the servers to an already existent AWS EC2 machine
- `systemd`: contains the systemd files to execute the servers as daemons

In order to deploy the servers it is needed to specify the following secrets inside the GitHub repository:

- `HOST`: the IP address of the AWS EC2 machine
- `PORT`: the port of the SSH server inside the EC2 machine
- `SSH_KEY`: the private SSH key used to connect to the EC2 machine
- `USERNAME`: the username used to connect to the SSH server on the EC2 machine

The secrets are used by github action workflows to securely connect to the EC2 machine.

## Possible improvements

- Create AWS EC2 machine through Terraform code (IaC)
- Add a linter in CI/CD GitHub actions
- Add automatic security checks in CI/CD GitHub actions
- Use an external storage

## Deployment

Each step has been implemented in a separate server. All the servers have been deployed to the following EC2 machine:

- IP Address: 34.243.42.215
- Hostname: tcpecho.alessandropolidori.com
    - step1 on port 9000
    - step2 on port 9001
    - step3 on port 9002
    - step4 on port 9003

## How to use it

You can directly test it connecting to the above servers. For example to connect to the TCP Echo Server of Step-1 (`src/step-1_tcp-echo-server.js`) you can use a networking utility such as [netcat](https://nc110.sourceforge.io/) from your command line:

```zsh
nc tcpecho.alessandropolidori.com 9000
```

and the output example is:

```zsh
# nc tcpecho.alessandropolidori.com 9000

one
one
two
two
three
three
```