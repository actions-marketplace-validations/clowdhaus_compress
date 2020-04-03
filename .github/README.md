<p align="center">
  <img src="./compress.jpg" alt="aws-actions" height="196px">
</p>
<h1 style="font-size: 56px; margin: 0; padding: 0;" align="center">
  compress
</h1>
<p align="center">
  <img src="https://badgen.net/badge/TypeScript/strict%20%F0%9F%92%AA/blue" alt="Strict TypeScript">
  <img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="Commitizen friendly">
  <img src="https://snyk.io/test/github/clowdhaus/compress/master/badge.svg" alt="Known Vulnerabilities">
</p>

GitHub action to run `upx` on specified executables and binaries.

## Usage

```yml
- uses: clowdhaus/compress@v0.1
  with:
    # The CloudFront distribution ID
    # Required: true
    distribution-id: ''

    # A value that you specify to uniquely identify an invalidation request. CloudFront uses the
    # value to prevent you from accidentally resubmitting an identical request. Whenever you
    # create a new invalidation request, you must specify a new value for `caller-reference`
    # and change other values in the request as applicable.
    # Default: git SHA that triggered the workflow
    caller-reference: ''

    # Path patrerns that contains information about the objects that you want to invalidate.
    # For more information, see
    # https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html
    # Note: Use the yaml mutiline pipe | to specify multiple paths, one on each line
    # Default: '/*' (invalidates entire distribution)
    paths: ''
```

## Scenarios

### Invalidate entire distribution

```yml
- uses: clowdhaus/aws-github-actions/packages/cloudfront_invalidate@v0.2
  with:
    distribution-id: E323PSTTFMI4A7
```

### Invalidate multiple paths

```yml
- uses: clowdhaus/aws-github-actions/packages/cloudfront_invalidate@v0.2
  with:
    distribution-id: E323PSTTFMI4A7
    paths: |
    /index.html
    /error.http
    /dist/*
```

## Getting Started

This project is setup as a monorepo using [lerna](https://github.com/lerna/lerna) and [yarn](https://github.com/yarnpkg/yarn) workspaces. If you are unfamiliar with these tools or the practice of a monorepo, I would suggest taking a look at the following articles (I am certain there are many more, but these seemed complete and worthy of a mention):

- [Create a Monorepo with Lerna & Yarn Workspaces](https://medium.com/hy-vee-engineering/creating-a-monorepo-with-lerna-yarn-workspaces-cf163908965d)
- [Why Lerna and Yarn Workspaces is a Perfect Match for Building Mono-Repos – A Close Look at Features and Performance](https://doppelmutzi.github.io/monorepo-lerna-yarn-workspaces/)

The following instructions will help you get setup for development and testing purposes.

### Prerequisites

#### [yarn](https://github.com/yarnpkg/yarn)

`yarn` is used to handle dependencies and executing scripts on the codebase.

See [here](https://yarnpkg.com/en/docs/install#debian-stable) for instructions on installing yarn on your local machine.

#### [lerna](https://github.com/lerna/lerna)

`lerna` is used to managed the project as a monorepo - where each action is packaged and managed individually, and some packages are internal modules shared across the actions.

To install lernal locally on your machine, it is recommended to install globally via npm or yarn:

```bash
$ npm install lerna --globally
  -- or --
$ yarn global add lerna
```

Once you have installed both `yarn` and `lerna`, you can install the project dependencies by running the following command from within the project root directory:

```bash
  $ yarn
```

Note: You may come across the comand sequence `lerna bootstrap` in the `lerna` documentation; this is equivalent to running `yarn` where both commands will pull down the necesary dependencies for the project and its packages.

## Contributing

Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details on our code of conduct and the process for submitting pull requests.

## Changelog

Please see the [CHANGELOG.md](../CHANGELOG.md) for details on individual releases.
