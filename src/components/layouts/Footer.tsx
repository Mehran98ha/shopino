import { AiWebBrowsingIcon, GithubIcon, NewTwitterIcon } from '../common/icons'

export default () => {
  return (
    <footer className="mt-8 border-border/40 border-t">
      <div className="container mx-auto flex items-center justify-between gap-4 p-4">
        <p className="text-muted-foreground text-xs">
          Developed by{' '}
          <span className="font-medium text-foreground underline decoration-wavy underline-offset-4">
            Mehran Heidaryan
          </span>
        </p>
        <div className="flex items-center gap-6">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/mehran98ha"
          >
            <GithubIcon className="size-5 text-foreground" />
          </a>
          <a target="_blank" rel="noreferrer" href="https://x.com/mehran98h">
            <NewTwitterIcon className="size-5 text-foreground" />
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://creatordev.ir"
          >
            <AiWebBrowsingIcon className="size-5 text-foreground" />
          </a>
        </div>
      </div>
    </footer>
  )
}
