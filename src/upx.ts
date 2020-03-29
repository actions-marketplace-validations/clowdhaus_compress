import * as process from 'process'
import * as io from '@actions/io'
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'
import * as path from 'path'
import download from 'download'
import {Octokit} from '@octokit/rest'

const WORKSPACE = process.env.GITHUB_WORKSPACE as string
const PLATFORM = process.platform
const TAG = '3.96'

export default class Upx {
  private readonly path: string

  private constructor(exePath: string) {
    this.path = exePath
  }

  // download upx release asset from Github
  static async downloadRelease(): Promise<string> {
    const postFix = PLATFORM === 'win32' ? 'win64.zip' : 'amd64_linux.tar.xz'

    const octokit = new Octokit()
    const {data: releases} = await octokit.repos.getReleaseByTag({
      owner: 'upx',
      repo: 'upx',
      tag: `v${TAG}`
    })
    const asset = releases.assets.filter((rel: any) => rel.name === `upx-${TAG}-${postFix}`)[0]
    const assetPath = path.join(WORKSPACE, asset.name)

    await download(asset.browser_download_url, WORKSPACE)
    return assetPath
  }

  static async getOrInstall(): Promise<Upx> {
    try {
      return await Upx.get()
    } catch (error) {
      core.debug(`Unable to find "upx" executable, installing it now. Reason: ${error}`)
      return await Upx.install()
    }
  }

  // Will throw an error if `upx` is not installed.
  static async get(): Promise<Upx> {
    // remove default on unbuntu hosted runner
    if (!PLATFORM.startsWith('win')) {
      await exec.exec('sudo rm -rf /usr/bin/upx')
    }

    const exePath = await io.which('upx', true)
    return new Upx(exePath)
  }

  // install executable for the appropriate platform
  private static async install(): Promise<Upx> {
    const assetPath = await Upx.downloadRelease()

    switch (PLATFORM) {
      case 'darwin':
      case 'linux': {
        await exec.exec(`tar xf ${assetPath}`)
        const fullPath = path.join(WORKSPACE, `upx-${TAG}-amd64_linux`)
        core.addPath(fullPath)
        break
      }

      case 'win32': {
        const extractPath = await tc.extractZip(assetPath)
        const fullPath = path.join(extractPath, `upx-${TAG}-win64`)
        core.addPath(fullPath)
        break
      }

      default:
        throw new Error(`Unknown platform ${PLATFORM}, can't install upx`)
    }
    return new Upx('upx')
  }

  async version(): Promise<string> {
    const stdout = await this.callStdout(['--version'])

    return stdout.split(' ')[1]
  }

  // upx which `program`
  async which(program: string): Promise<string> {
    const stdout = await this.callStdout(['which', program])

    if (stdout) {
      return stdout
    } else {
      throw new Error(`Unable to find the ${program}`)
    }
  }

  async call(args: string[], options?: {}): Promise<number> {
    return await exec.exec(this.path, args, options)
  }

  // Call the `upx` and return stdout
  async callStdout(args: string[], options?: {}): Promise<string> {
    let stdout = ''
    const resOptions = Object.assign({}, options, {
      listeners: {
        stdout: (buffer: Buffer) => {
          stdout += buffer.toString()
        }
      }
    })

    await this.call(args, resOptions)

    return stdout
  }
}
