# ftm-joy-ui

React components based on [Joy UI](https://mui.com/joy-ui/getting-started/overview/) for rendering [follow the money](https://followthemoney.tech) stuff.

There have been efforts by the [aleph team](https://github.com/alephdata/) to maintain a `react-ftm` library which eventually got inlined into the main codebase, so this one here is based on the idea of that but not intended to be a replacement. It will not become a real npm "library", just a git repo where common code is collected.

Projects using these components should simply use this repo as a [git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules)

## usage

Within your project, add the submodule, as a convention to the path `lib/ftm`:

    git submodule add https://github.com/investigativedata/ftm-joy-ui.git lib/ftm

Updating from remote:

    git submodule update --remote lib/ftm


## supported by
[Media Tech Lab Bayern batch #3](https://github.com/media-tech-lab)

<a href="https://www.media-lab.de/en/programs/media-tech-lab">
    <img src="https://raw.githubusercontent.com/media-tech-lab/.github/main/assets/mtl-powered-by.png" width="240" title="Media Tech Lab powered by logo">
</a>
