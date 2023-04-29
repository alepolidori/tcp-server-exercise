# TCP Servers

This Git repository contains all the four steps of the home assignment.

- `src` directory contains the source code: one file for each step.
- `.github/wrokflows`: contains the GitHub actions to depoy the servers to an already existent AWS EC2 machine.
- `systemd`: contains the systemd files to execute the servers as daemons

In order to deploy the servers it is needed to specify the following secrets inside the GitHub repository:

- `HOST`: the IP address of the AWS EC2 machine
- `PORT`: the port of the SSH server inside the EC2 machine
- `SSH_KEY`: the private SSH key used to connect to the EC2 machine
- `USERNAME`: the username used to connect to the SSH server on the EC2 machine

## Possible improvements

- Create AWS EC2 machine through Terraform code (IaC)
- Add a linter in CI/CD GitHub actions
- Add automatic security checks in CI/CD GitHub actions
- Use an external storage
