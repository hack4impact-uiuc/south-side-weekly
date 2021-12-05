<h1 align="center">
  <a href="https://uiuc.hack4impact.org"><img src="https://raw.githubusercontent.com/hack4impact-uiuc/uiuc.hack4impact.org/master/public/images/colored-logo.svg" alt="hack4impact logo" width="150"></a>
  <br/>
  South Side Weekly
  </br>
</h1>

<p align="center">
    <img src="https://img.shields.io/github/checks-status/hack4impact-uiuc/south-side-weekly/main?style=flat-square">
    <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square">
</p>

<h4 align="center">A project by <a href="https://uiuc.hack4impact.org/" target="_blank">Hack4Impact UIUC</a> in collaboration with <a href="https://southsideweekly.com" target="_blank">South Side Weekly</a></h4>

<p align="center">
  <a href="#background">Background</a> •
  <a href="#usage">Usage</a> •
  <a href="#technologies">Technologies</a> •
  <a href="#team">Team</a> •
  <a href="#setup">Setup</a> • 
  <a href="#license">License</a>
</p>

## Background

South Side Weekly (SSW) is a nonprofit newspaper dedicated to supporting cultural and civic engagement on the South Side of Chicago, as well as developing emerging journalists, writers, and artists. The Weekly covers a range of topics, including politics, the arts, public interest issues, as well as poetry, fiction, and local artwork.

The majority of The Weekly's staff are volunteers, with their main contributor base coming from their readers themselves. SSW is is currently in need of a volunteer hub that can streamline the onboarding process and help volunteers and staff keep track of pitches, assignments, and contributions.

[Full PRD](https://docs.google.com/document/d/1p9lpH-tn6EgFzTyAAH_j1hcLqDznzfJ9vQZjzb0koqY/edit?usp=sharing)

## Usage

The latest version of this application can be found at [ssw.h4i.app](https://ssw.h4i.app/).

To install and set up locally, follow the instructions in the [`/client`](https://github.com/hack4impact-uiuc/mern_template/tree/main/client) and [`/api`](https://github.com/hack4impact-uiuc/mern_template/tree/main/api) directories.

## Technologies

This application is built with React + Semantic UI, Typescript, Express, MongoDB, and tested with Cypress and Jest. Vercel is used for automatic deployment.

## Team

<table align="center">
  <tr>
    <td align="center"><a href="https://www.linkedin.com/in/sahithimuthyala/"><img src="./photos/sahi-muth.jpg" width="75px;" alt="Sahi Muthyala"/><br /><b>Sahithi Muthyala</b></a><br /><sub>Product Manager</sub></td>
    <td align="center"><a href="https://www.linkedin.com/in/amit-m-sawhney/"><img src="./photos/amit-sawhney.jpg" width="75px;" alt="Amit Sawhney"/><br /><b>Amit Sawhney</b></a><br /><sub>Technical Lead</sub></td>
    <td align="center"><a href="https://linkedin.com/in/bryange"><img src="./photos/bryan-ge.jpg" width="75px;" alt="Bryan Ge"/><br /><b>Bryan Ge</b></a><br /><sub>Product Designer</sub></td>
    <td align="center"><a href="https://www.linkedin.com/in/alicesf2/"><img src="./photos/alice-fang.jpeg" width="75px;" alt="Alice Fang"/><br /><b>Alice Fang</b></a><br /><sub>Former Technical Lead</sub></td>
    <td align="center"><a href="https://www.linkedin.com/in/mustafasyedali/"><img src="./photos/mustafa-ali.jpg" width="75px;" alt="Mustafa Ali"/><br /><b>Mustafa Ali</b></a><br /><sub>Former Product Designer</sub></td>
    </tr>
    <tr>
    <td align="center"><a href="https://www.linkedin.com/in/danielle-yang-254308154/"><img src="./photos/danielle-yang.jpg" width="75px;" height="75px;" alt="Danielle Yang"/><br /><b>Danielle Yang</b></a><br /><sub>Software Developer</sub></td>
    <td align="center"><a href="https://www.linkedin.com/in/eugenia-chen-3aa251131/"><img src="./photos/eugenia-chen.jpg" width="75px;" height="75px;" style="object-fit:cover;" alt="Eugenia Chen"/><br /><b>Eugenia Chen</b></a><br /><sub>Software Developer</sub></td>
    <td align="center"><a href="https://neeraj.lol"><img src="./photos/aditya-jain.jpg" width="75px;" alt="Aditya Jain"/><br /><b>Aditya Jain</b></a><br /><sub>Software Developer</sub></td>
    <td align="center"><a href="https://www.linkedin.com/in/andrew-s-lester/"><img src="./photos/andrew-lester.jpg" width="75px;" alt="Andrew Lester"/><br /><b>Andrew Lester</b></a><br /><sub>Software Developer</sub></td>
    <td align="center"><a href="https://www.linkedin.com/in/neha-konjeti-574135199/"><img src="./photos/neha-konjeti.jpg" width="75px;" alt="Neha Konjeti"/><br /><b>Neha Konjeti</b></a><br /><sub>Software Developer</sub></td>
    </tr>
    <tr>
    <td align="center"><a href="https://www.linkedin.com/in/feiyuwong/"><img src="./photos/andy-wong.jpg" width="75px;" alt="Andy Wong"/><br /><b>Andy Wong</b></a><br /><sub>Software Developer</sub></td>
    <td align="center"><a href="https://www.linkedin.com/in/zorazhang28/"><img src="./photos/zora-zhang.jpg" width="75px;" alt="Zora Zhang"/><br /><b>Zora Zhang</b></a><br /><sub>Software Developer</sub></td>
    <td align="center"><a href="https://www.linkedin.com/in/ayan-mallik/"><img src="./photos/ayan-mallik.jpg" width="75px;" alt="Ayan Mallik"/><br /><b>Ayan Mallik</b></a><br /><sub>Software Developer</sub></td>
    </tr>
</table>

## Setup

The following is a guide to run this repository. 

<hr />

### Prerequisites

#### Software 

- [Node.js](https://nodejs.org/en/download/)
- [Git](https://git-scm.com/downloads)

Install [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable) 
(_Node.js required_)

```bash
npm install --global yarn
``` 
<hr />

### Cloning the repository

Within a local directory of your choosing, please run either

##### HTTP
```bash
git clone https://github.com/hack4impact-uiuc/south-side-weekly.git
```
##### SSH

```bash
git clone git@github.com:hack4impact-uiuc/south-side-weekly.git
```
_SSH will only work if your SSH keys are properly [setup](https://docs.github.com/en/enterprise-server@3.0/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)_.

<hr />

### Creating the `.env` 

Create a file called `.env` [here](https://github.com/hack4impact-uiuc/south-side-weekly/tree/main/api), in the root of the api directory. 

```
PROD_MONGO_URL=
DEV_MONGO_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:9000/api/auth/redirectURI
SESS_SECRET=
EMAIL_USERNAME=h4i.ssw@gmail.com
EMAIL_PASS=
FE_URI=http://localhost:3000
```
For any missing fields, please reach out to Amit.

<hr />

### Running the app

#### Client

In the [client](https://github.com/hack4impact-uiuc/south-side-weekly/tree/main/client) directory, follow the [`README.md`](https://github.com/hack4impact-uiuc/south-side-weekly/tree/main/client#readme) in the respective directory. 

#### API
In the [api](https://github.com/hack4impact-uiuc/south-side-weekly/tree/main/api) directory, follow the [`README.md`](https://github.com/hack4impact-uiuc/south-side-weekly/tree/main/api#readme) in the respective directory.

<hr />

## License

[MIT](https://github.com/hack4impact-uiuc/ymca/blob/master/LICENSE) licensed. Copyright © 2020 [Hack4Impact UIUC](https://github.com/hack4impact-uiuc).
