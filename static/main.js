"use strict";

document.addEventListener("click", onClick);


//

function onClick(e)
{
    return visit(e.target);

    function visit(e)
    {
        if (!e) return;

        let className = e.className || "";
        if (/snip-hide/.test(className))
        {
            // Expand code snippets.
            e.className =
                /snip-hide-top/.test(className)
                    ? "snip-reveal snip-reveal-top"
                    : "snip-reveal snip-reveal-bottom";
        }
        else if (/nav-label/.test(className))
        {
            // Allow animation on expanded nav trees.
            e.parentNode.querySelector(".nav-children")
                               .classList.add("nav-reveal");
        }
        else if (/tb-theme/.test(className))
        {
            Theme_toggle();
        }
        else
        {
            return visit(e.parentElement);
        }
    }
}


// Dark mode toggle.

const DARK  = "dark";
const LIGHT = "light";
const THEME = "theme";

let _theme_user     = localStorage.getItem(THEME) || null;
let _theme_system   = null;
let _theme_dom      = null;

function Theme_onSystem(mediaQuery)
{
    _theme_system   = mediaQuery && mediaQuery.matches ? DARK : LIGHT;

    Theme_flush();
}

function Theme_toggle()
{
    _theme_user     = (_theme_user || _theme_system) === DARK ? LIGHT : DARK;

    if (_theme_user === _theme_system)
        _theme_user = "";

    localStorage.setItem(THEME, _theme_user);

    Theme_flush();
}

function Theme_flush()
{
    if (_theme_dom !== _theme_user)
    {
        if (_theme_dom === DARK)
            document.body.classList.remove(DARK);
        if (_theme_dom === LIGHT)
            document.body.classList.remove(LIGHT);

        _theme_dom = _theme_user;

        if (_theme_dom === DARK)
            document.body.classList.add(DARK);
        if (_theme_dom === LIGHT)
            document.body.classList.add(LIGHT);
    }

    console.log("THEME", { _theme_user, _theme_system, _theme_dom });
}

{
    let mediaQuery = window.matchMedia
                  && window.matchMedia("(prefers-color-scheme: dark)");

    if (mediaQuery)
    {
        Theme_onSystem(mediaQuery);
        mediaQuery.addEventListener("change", Theme_onSystem);
    }
    else
    {
        Theme_onSystem(null);
    }
}


// Prefetch links on hover.

document.body.addEventListener("mouseover", e =>
{
    e = e.target;

    let href = e instanceof HTMLAnchorElement && e.href;
    if (href)
    {
        if (/^\//.test(href) || href.startsWith(location.origin))
        {
            if (!sessionStorage.getItem(href))
            {
                sessionStorage.setItem(href, "did-prefetch");

                // <link rel="prefetch" href="next.html" />
                let link    = document.createElement("link");
                link.href   = href;
                link.rel    = "prefetch";

                document.head.appendChild(link);
            }
        }
    }
});
