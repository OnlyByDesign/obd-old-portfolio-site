'use strict';
//////////////////////////////////////////////////////////
// NAV directory
var NAV = { nav:'navMain' , navItem:'.nav__item' , navIcon:'.nav__icon' , logo:'.nav__logo svg' , contact:'navSub' , contactBtn:'contactBtn' , contactInfo:'contactInfo' , contactInfoMain:'.info__main' };
var navDOM = document.getElementById(NAV.nav);
var navLogoDOM = document.querySelector(NAV.logo);
var navIconDOM = document.querySelector(NAV.navIcon);
var navContactDOM = document.getElementById(NAV.contactBtn);
var navInfoDOM = document.getElementById(NAV.contactInfo);
var navInfoItemDOM = document.querySelector(NAV.contactInfoMain)
//////////////////////////////////////////////////////////
// DOM directory
var DOM = { main:'mainSec', back:'back', about:'aboutPg', detail:'detailPg', cover:'coverPg', coverItem:'.item__text', archive:'archivePg', archBody:'.archive__body', archItem:'.archive__item' };
var bodyDOM = document.getElementsByTagName('body')[0];
var artDOM = document.getElementsByTagName('article')[0];
var backDOM = document.getElementById(DOM.back);
var aboutDOM = document.getElementById(DOM.about);
var detailDOM = document.getElementById(DOM.detail);
var mainDOM = document.getElementById(DOM.main);
var contDOM = document.querySelector(DOM.coverItem);
var coverDOM = document.getElementById(DOM.cover);
var coverItemDOM = document.querySelectorAll(DOM.coverItem);
var coverWork = coverDOM.children;
var archDOM = document.getElementById(DOM.archive);
var archItem = document.querySelectorAll(DOM.archItem);
var archWork = archDOM.children;
var archBody = document.querySelector(DOM.archBody);
var totalSection = Object.keys(coverWork).map(function(e){return coverWork[e]}).concat(archBody);
var totalWork = Object.keys(coverWork).map(function(e){return coverWork[e]}).concat(Object.keys(archWork[1].children).map(function(e) {return archWork[1].children[e]}));
//////////////////////////////////////////////////////////
// FUNCTION directory
var navController, controllerEvent, eventScroll, eventCover, eventArchive, eventDetails, controllerArticle, articleInsert, articleChange, articlePurge, loadRequest, pageReset, changeColor, activeChange, activePurge, scrollLock, scrollToggle, navIconToggle, navAboutToggle, navInfoToggle, fgToggle, fgRemove, articleOpen, articleNext, init;
var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
//////////////////////////////////////////////////////////
// FG IMAGES
(function() {
    var target = Object.keys(coverDOM.children).map(function(e) {return coverDOM.children[e]});
    target.forEach(function(curr, index) {
        if (index !== coverDOM.children.length) {
            var item = curr.dataset.item;
            if (typeof item !== null) {
                document.querySelector('.cover__fg').innerHTML += '<div class="fg__item ' + curr.dataset.item + '"></div>';
            };
        };
    });
})();
//////////////////////////////////////////////////////////
// NAVIGATION
navController = function(el) {
    var active = false;
    return function(el) {
        if (!active) {
            var artDOM = document.getElementsByTagName('article')[0];
            active = true;
            if (el.id === 'navToggle') {
                artDOM.hasAttribute('id') ? articlePurge() : navAboutToggle();
            };
            if (el.id === 'contactBtn' || el.classList.contains('info__icon')) {
                navInfoToggle();
            };
            setTimeout(function() {
                active = false;
            }, 500);
        };
    };
}();
//////////////////////////////////////////////////////////
// EVENTS
controllerEvent = function controllerEvent() {
    var events = ['wheel', 'touchstart', 'touchmove', 'touchend', 'touchcancel'];
    var artDOM = document.getElementsByTagName('article')[0];
    var archBody = document.querySelector('.archive__body');
    events.forEach(function(events) {
        window.addEventListener(events, function(e) {
            if (!scrollTimer) {
                var scrollTimer = setTimeout(function() {
                    !artDOM.hasAttribute('id') ? eventScroll(e, events) : null;
                    scrollTimer = null;
                }, 100);
            };
        }, { capture: true, passive: true });
    });
    archBody.addEventListener('wheel', function(event) { scrollToggle(event) });
};
eventScroll = function eventScroll(e) {
    var coverPos, contPos, archPos;
    coverPos = document.querySelector('.main__cover').getBoundingClientRect();
    contPos = document.querySelector('.item__text').getBoundingClientRect();
    archPos = document.querySelector('.main__archive').getBoundingClientRect();
    if (mainDOM.classList.contains('work')) {
        if (coverPos.top < contPos.top || coverPos.bottom > contPos.top) eventCover(e);
        if (archPos.top < contPos.top) eventArchive(e);
    };
    if (mainDOM.classList.contains('archive')) {
        if (archPos.top > contPos.top) eventCover(e);
    };
};
eventCover = function eventCover(e) {
    var a = document.querySelector('.main__cover').children;
    var target = Object.keys(a).map(function(e) {return a[e]});
    var contPos = document.querySelector('.item__text').getBoundingClientRect();
    var archDOM = document.getElementById('archivePg');
    var mainDOM = document.getElementById('mainSec');
    archDOM.classList.contains('active') ? archDOM.classList.remove('active') : null;
    mainDOM.classList.contains('archive') ? mainDOM.classList.replace('archive', 'work') : null;
    target.forEach(function(current, i) {
        var workPos = target[i].getBoundingClientRect();
        if (!(workPos.bottom < contPos.top || workPos.top > contPos.bottom) && !coverWork[i].classList.contains('active')) {
            activeChange(coverWork[i]);
            eventDetails(coverWork[i], e);
        };
    });
};
eventArchive = function eventArchive() {
    var mainDOM = document.getElementById('mainSec');
    var archDOM = document.getElementById('archivePg');
    var archItem = document.querySelectorAll('.archive__item');
    if (!archDOM.classList.contains('active')) {
        mainDOM.classList.contains('work') ? mainDOM.classList.replace('work', 'archive') : null;
        eventDetails(archDOM);
        activePurge(coverDOM);
        fgRemove(document.querySelector('.fg__item.active'));
        archDOM.classList.add('active');
        archItem.forEach(function(curr) {
            curr.onmouseover = function() {
                eventDetails(curr);
            };
        });
    }
};
eventDetails = function eventDetails(curr, e) {
    var archBody = document.querySelector('.archive__body');
    var info, tag, number, date, copy, el;
    changeColor(curr);
    if (curr.classList.contains('cover__item') || curr.classList.contains('main__archive')) {
        var setTag = function setTag() {
            document.querySelector('.cover__fg').id = tag;
        };
        var getDate = function getDate() {
            document.querySelector('.bg__date').innerHTML = date;
        };
        var getNum = function getNum() {
            var current = function() {
                var c;
                totalSection.forEach(function (totalSection, currentValue) {
                    if (totalSection.dataset.item === tag) {
                        c = currentValue;
                    };
                });
                return c;
            }();
            document.querySelector('.bg__number .current').innerHTML = current + 1;
        };
        var getCopy = function getCopy() {
            document.querySelector('.bg__copy').innerHTML = copy;
        };
        if (typeof e != 'undefined' && e.srcElement.classList.contains('work__next') && curr === archBody.firstElementChild) {
            curr = curr.parentElement.parentElement;
        };
        tag = curr.dataset.item;
        if (curr.dataset.info) {
            info = curr.dataset.info.split(" + ");
            date = '&#146;' + info[0];
            copy = info[1];
        };
        el = document.querySelector('.fg__item.' + tag);
        number = document.querySelector('.bg__number');
        getDate();
        getCopy();
        if (curr.classList.contains('cover__item')) {
            activeChange(el);
            fgToggle(el, e);
            setTag();
            getNum();
            if (number.style.display = 'none') {
                number.style.removeProperty('display');
            };
        };
        if (curr.classList.contains('main__archive')) {
            number.style.display = 'none';
        };
        if (!curr.classList.contains('archive__item')) {
            scrollLock(curr, e);
        };
    };
};
//////////////////////////////////////////////////////////
// ARTICLE
controllerArticle = function controllerArticle(e, request) {
    var artDOM = document.getElementsByTagName('article')[0];
    var work = e.srcElement.parentNode;
    var workStyle = window.getComputedStyle(work);
    articleOpen(e, work);
    setTimeout(function() {
        artDOM.innerHTML += '\n        <div id="workHero" class="overlay__hero overlay__section active" style="background-image:\n        ' + workStyle.getPropertyValue('background-image').match(new RegExp('linear' + '(.*)' + 'url'))[0] + '(' + workStyle.getPropertyValue('background-image').match(new RegExp('http' + '(.*)' + 'jpg'))[0].replace('-bw', '') + ');background-size:' + workStyle.getPropertyValue('background-size') + ';">\n            <h1 style="opacity:0">' + work.getElementsByTagName(work.classList.contains('cover__item') ? 'h1' : 'h3')[0].innerHTML + '</h1>\n        </div>';
        window.getComputedStyle(document.getElementById('workHero')).getPropertyValue('background-image').match(new RegExp('rgba' + '(.*)' + 'rgba'))[0].split('0.')[1].split('),')[0] * 2;
    }, 250);
    setTimeout(function() {
        artDOM.style.removeProperty('overflow-y');
        artDOM.insertAdjacentHTML('beforeend', request.responseText);
        articleInsert(work);
    }, 1400);
};
articleInsert = function articleInsert(target) {
    var artDOM = document.getElementsByTagName('article')[0];
    var next = target.nextElementSibling;
    if (target === coverDOM.lastElementChild) {
        next = target.parentNode.nextElementSibling.children[1].firstElementChild;
    } else if (target === archDOM.lastElementChild.lastElementChild) {
        next = coverDOM.firstElementChild;
    };
    artDOM.insertAdjacentHTML('beforeend', '\n    <div id="next" class="work__next" onclick="articleChange(event);">\n        <h5>next project</h5>\n        <div class="work__next--preview">\n            <h1>' + next.getElementsByTagName(next.classList.contains('cover__item') ? 'h1' : 'h3')[0].innerHTML + '</h1>\n        </div>\n    </div>');
    artDOM.lastChild.children[1].style.backgroundImage = window.getComputedStyle(next).getPropertyValue('background-image').replace('-bw', '');
};
articleChange = function articleChange(e) {
    var mainDOM, archDOM, archBody, workHero, parent, current, nextEl;
    mainDOM = document.getElementById('mainSec');
    archDOM = document.getElementById('archivePg');
    archBody = document.querySelector('.archive__body');
    workHero = document.getElementById('workHero');
    parent = document.querySelector('a[href=\'' + e.srcElement.parentNode.id.split('Pg')[0] + '.html\']').parentNode;
    current = function() {
        var c;
        totalWork.forEach(function(totalWork, curr) {
            if (totalWork.dataset.item == undefined) {
                return;
            };
            if (totalWork.dataset.item.indexOf(parent.dataset.item) === 0) {
                c = curr;
            };
        });
        return c;
    }();
    nextEl = totalWork[current + 1];
    if (nextEl == undefined) {
        nextEl = totalWork[0];
        archBody.scrollLeft = 0;
    };
    if (nextEl === archDOM.lastElementChild.firstElementChild) {
        mainDOM.classList.replace('work', 'archive');
        archDOM.classList.add('active');
        fgRemove(document.querySelector('.fg__item.active'));
        activePurge(coverDOM);
    };
    loadRequest(nextEl.children[0].href, nextEl.children[0]);
    articleNext(nextEl);
    activeChange(nextEl);
    eventDetails(nextEl, e);
    workHero.children[0].innerHTML = nextEl.getElementsByTagName(nextEl.classList.contains('cover__item') ? 'h1' : 'h3')[0].innerHTML;
    workHero.style.backgroundImage = window.getComputedStyle(nextEl).getPropertyValue('background-image').replace('-bw', '');
};
articlePurge = function articlePurge() {
    var artDOM = document.getElementsByTagName('article')[0];
    document.querySelector('.nav__icon').classList.remove('overlay');
    artDOM.removeAttribute('id');
    artDOM.classList.add('active__archive');
    anime({
        targets: artDOM,
        opacity: '0',
        duration: 500,
        easing: 'easeInOutCubic'
    });
    setTimeout(function() {
        artDOM.style.removeProperty('opacity');
        artDOM.style.removeProperty('background-color');
        artDOM.removeAttribute('class');
        artDOM.innerHTML = '';
    }, 1025);
};
//////////////////////////////////////////////////////////
// CALLBACKS
function loadRequest(file, e) {
    var artDOM, current, request;
    artDOM = document.getElementsByTagName('article')[0];
    current = XMLHttpRequest.prototype.open;
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        request = new ActiveXObject("Microsoft.XMLHTTP");
    };
    XMLHttpRequest.prototype.open = function() {
        current.apply(this, arguments);
    };
    request.open('GET', file, true);
    request.onreadystatechange = function() {
        var req = request.responseURL.split('/').slice(-1).toString().replace('.html', '');
        if (request.status !== 200) {
            console.log(request.status + ' on ' + request.responseURL);
            return;
        };
        if (this.readyState === 3 && this.status === 200) {
            artDOM.id = req + 'Pg';
            if (!e.target) {
                while (artDOM.lastChild.id !== 'workHero') {
                    artDOM.removeChild(artDOM.lastChild);
                };
            };
        };
        if (this.readyState === 4 && this.status === 200) {
            if (e.target) {
                controllerArticle(e, request);
            } else {
                artDOM.insertAdjacentHTML('beforeend', request.responseText);
            };
        };
    };
    request.send();
};
function pageReset(e) {
    var aboutDOM, artDOM, target, last;
    aboutDOM = document.getElementById('aboutPg');
    artDOM = document.getElementsByTagName('article')[0];
    archBody = document.querySelector('.archive__body');
    target = document.getElementById('coverPg').children[0];
    last = document.querySelector('.fg__item.active');
    if (!aboutDOM.classList.contains('about__sec--inactive') || last.classList.contains('' + target.dataset.item)) {
        return;
    } else if (artDOM.hasAttribute('id')) {
        articlePurge();
    } else if (last) {
        fgRemove(last);
        last.removeAttribute('style');
        activePurge(document.querySelector('.cover__item.active'));
    } else if (!last) {
        archBody.scrollLeft = 0;
        fgToggle(document.querySelector('.cover__fg').children[0]);
    };
    mainDOM.scrollIntoView({ behavior: "smooth" });
    changeColor(target);
    activeChange(target);
    eventDetails(target, e);
};
function changeColor(curr) {
    var bodyDOM = document.getElementsByTagName('body')[0];
    var color = curr.dataset.bg;
    bodyDOM.style.backgroundColor = '#' + color;
    document.getElementById('coverBg').style.backgroundColor = '#' + color;
};
function activeChange(el) {
    el.classList.add('active');
    el.previousElementSibling === null ? null : el.previousElementSibling.classList.remove('active');
    el.nextElementSibling === null ? null : el.nextElementSibling.classList.remove('active');
};
function activePurge(el) {
    var activeNode = el.querySelectorAll(".active");
    activeNode.forEach(function(activeNode) {
        activeNode.classList.remove('active');
    });
};
function scrollLock(el) {
    if (viewportWidth < 1024) {
        return false;
    } else {
        var lock = function lock(element, time) {
            element.classList.add('lock');
            setTimeout(function() {
                element.classList.remove('lock');
            }, time);
        };
        el.scrollIntoView({ 
            behavior: "smooth",
            block: "center",
            inline: "center"
        });
        lock(mainDOM, 1000);
    };
};
function scrollToggle(e) {
    if (viewportWidth < 1024) {
        return false;
    } else {
        var bodyDOM = document.getElementsByTagName('body')[0];
        var archDOM = document.getElementById('archivePg');
        if (archDOM.getBoundingClientRect().bottom <= bodyDOM.getBoundingClientRect().bottom + 25) {
            var item = e.srcElement.parentElement.parentElement;
            var scroll = e.deltaY > 0 ? item.scrollLeft += 100 : item.scrollLeft -= 100;
            if (item.offsetLeft === item.scrollLeft) {
                setTimeout(function() {
                    scroll;
                }, 100);
            } else {
                scroll;
            };
            if (item.getBoundingClientRect().left === item.children[0].getBoundingClientRect().left && e.deltaY <= 0) {
                setTimeout(function() {
                    return false;
                }, 500);
            } else {
                e.preventDefault();
            };
        };
    };
};
//////////////////////////////////////////////////////////
// INTERACTION
function navIconToggle() {
    document.querySelector('.nav__icon').classList.toggle('open');
    document.querySelector('main').classList.toggle('lock');
};
function navAboutToggle() {
    var aboutDOM = document.getElementById('aboutPg');
    var isActive = aboutDOM.classList.contains('about__sec--inactive');
    navIconToggle();
    anime({
        targets: aboutDOM.children[0],
        opacity: function() {
            if (isActive) {
                return [0, 1];
            } else {
                return [1, 0];
            }
        },
        easing: 'linear',
        duration: 350
    });
    anime({
        targets: aboutDOM.children[1],
        translateX: function() {
            if (isActive) {
                return ['100%', '0'];
            } else {
                return ['0', '100%'];
            }
        },
        easing: 'easeInOutCirc',
        duration: 400
    });
    anime({
        targets: document.querySelector('.about__content'),
        translateX: function() {
            if (isActive) {
                return ['125%', '0'];
            } else {
                return ['0', '150%'];
            }
        },
        easing: 'easeInOutCirc',
        duration: 400
    });
    if (isActive) {
        aboutDOM.classList.remove('about__sec--inactive');
    } else {
        setTimeout(function() {
            aboutDOM.classList.add('about__sec--inactive');
        }, 500);
    };
};
function navInfoToggle() {
    var bodyWidth = document.getElementsByTagName('body')[0].getBoundingClientRect().width;
    var navContactDOM = document.getElementById('contactBtn');
    var navInfoDOM = document.getElementById('contactInfo');
    var navInfoItemDOM = document.querySelector('.info__main');
    if (navInfoDOM.classList.contains('contact__info--inactive')) {
        anime({
            targets: navContactDOM,
            height: function() {
                if (bodyWidth >= 700) {
                    return ['50', '90'];
                } else {
                    return;
                }
            },
            translateY: function() {
                if (bodyWidth >= 700) {
                    return ['0', '-17.5'];
                } else {
                    return '0';
                }
            },
            easing: 'easeInOutQuad',
            duration: 250,
            begin: function() {
                navInfoDOM.classList.replace('contact__info--inactive', 'contact__info--active');
            },
            complete: function() {
                navContactDOM.style.backgroundColor = 'transparent';
            }
        });
        anime({
            targets: navInfoDOM,
            translateY: function() {
                if (bodyWidth >= 700) {
                    return ['130', '0'];
                } else {
                    return ['100%', '0'];
                }
            },
            easing: 'easeInOutQuad',
            duration: 250
        });
        anime({
            targets: navInfoItemDOM.children,
            translateY: ['100', '0'],
            easing: 'easeInOutQuad',
            duration: 250
        });
    } else {
        anime({
            targets: navContactDOM,
            height: function() {
                if (bodyWidth >= 700) {
                    return ['90', '50'];
                } else {
                    return '0';
                }
            },
            translateY: function() {
                if (bodyWidth >= 700) {
                    return ['-17.5', '0'];
                } else {
                    return '0';
                }
            },
            easing: 'easeInOutQuad',
            duration: 250,
            delay: 62,
            begin: function() {
                navContactDOM.style.removeProperty('background-color');
            }
        });
        anime({
            targets: navInfoDOM,
            translateY: function() {
                if (bodyWidth >= 700) {
                    return ['0', '130'];
                } else {
                    return ['0', '100%'];
                }
            },
            easing: 'easeInOutQuad',
            duration: 200,
            delay: 125
        });
        anime({
            targets: navInfoItemDOM.children,
            translateY: ['0', '100'],
            easing: 'easeInOutQuad',
            duration: 250
        });
        setTimeout(function() {
            navInfoDOM.classList.replace('contact__info--active', 'contact__info--inactive');
        }, 326);
    };
};
function fgToggle(el, e) {
    var curr = document.querySelector('.cover__fg').children;
    var target = Object.keys(curr).map(function(e) {return curr[e]});
    if (!e) return false;
    anime({
        targets: el,
        opacity: [0, 1],
        translateX: ['-15%', 0],
        duration: 650,
        easing: 'easeInOutCubic',
        complete: function() {
            el.removeAttribute('style');
        }
    });
    if (e !== 0) {
        if (e.deltaY > 0) {
            var prev = el.previousElementSibling === null ? null : el.previousElementSibling;
        } else {
            var prev = el.nextElementSibling === null ? null : el.nextElementSibling;
        };
        if (prev != null) {
            prev.style.visibility = 'visible';
        };
        anime({
            targets: prev,
            opacity: [1, 0],
            translateX: [0, '30%'],
            duration: 650,
            easing: 'easeInOutCubic',
            complete: function() {
                if (prev != null) {
                    prev.removeAttribute('style');
                };
            }
        });
    };
    if (e.srcElement.classList.contains('work__next')) {
        target.forEach(function(currentValue) {
            if (currentValue.hasAttribute('style') && !currentValue.classList.contains('active')) {
                currentValue.removeAttribute('style');
            };
        });
    };
};
function fgRemove(el) {
    if (!el || !el.classList.contains('active') || typeof el == undefined) {
        return false;
    } else {
        setTimeout(function() {
            anime({
                targets: el,
                opacity: [1, 0],
                translateX: [0, '15%'],
                duration: 525,
                easing: 'easeInOutCubic',
                complete: function() {
                    el.removeAttribute('style');
                    el.classList.remove('active');
                }
            });
        }, 100);
    };
};
function articleOpen(e, work) {
    var artDOM = document.getElementsByTagName('article')[0];
    var navIconDOM = document.querySelector('.nav__icon');
    var workPos = work.getBoundingClientRect();
    navIconDOM.classList.add('overlay');
    if (work.classList.contains('cover__item')) {
        artDOM.classList.add('main__overlay', 'active__cover');
        anime({
            targets: document.querySelector('.cover__fg'),
            zIndex: 999999,
            duration: 0
        });
    } else {
        artDOM.classList.add('main__overlay', 'active__archive');
    };
    anime({
        targets: artDOM,
        marginLeft: function() {
            return workPos.left;
        },
        height: function() {
            return workPos.height;
        },
        width: function() {
            return workPos.width;
        },
        marginTop: function() {
            return workPos.top;
        },
        padding: '0',
        duration: 0,
        easing: 'linear'
    });
    anime({
        targets: e.srcElement.nextElementSibling.children,
        duration: 250,
        delay: 250,
        opacity: [1, 0],
        easing: 'linear'
    });
    anime({
        targets: artDOM,
        opacity: [0, 1],
        duration: 250,
        delay: 1,
        easing: 'linear'
    });
    anime({
        targets: work,
        width: function() {
            return workPos.width;
        },
        marginLeft: function() {
            if (work.classList.contains('cover__item')) {
                return workPos.left;
            } else {
                return 0;
            }
        },
        duration: 200,
        easing: 'linear'
    });
    setTimeout(function() {
        work.style.transition = 'none';
        anime({
            targets: work,
            opacity: '0',
            duration: 0
        });
        anime({
            targets: artDOM,
            backgroundColor: 'rgba(0,0,0,0.85)',
            duration: 1000,
            easing: 'easeInOutCubic'
        });
        artDOM.classList.add('smooth');
        anime({
            targets: artDOM,
            duration: 200,
            delay: 0,
            width: '100%',
            height: function() {
                if (work.classList.contains('cover__item')) {
                    return workPos.height / 5 * 2;
                } else {
                    return workPos.height;
                }
            },
            marginTop: '0',
            easing: 'easeInOutCubic',
            complete: function() {
                artDOM.style.removeProperty('margin-top');
                artDOM.style.removeProperty('padding');
                artDOM.style.removeProperty('width');
                if (work.classList.contains('cover__item')) {
                    artDOM.style.removeProperty('margin-left');
                }
            }
        });
        if (work.classList.contains('archive__item')) {
            anime({
                targets: artDOM,
                duration: 200,
                marginLeft: '0',
                easing: 'easeInOutCubic'
            });
        };
        artDOM.style.setProperty('overflow-y', 'hidden');
        if (work.classList.contains('cover__item')) {
            document.querySelector('.cover__fg').style.removeProperty('z-index');
        };
    }, 250);
    setTimeout(function() {
        document.getElementById('workHero').style.removeProperty('background-size');
        document.getElementById('workHero').style.backgroundAttachment = 'fixed';
    }, 600);
    setTimeout(function() {
        artDOM.classList.remove('smooth');
        artDOM.classList.contains('active__cover') ? artDOM.classList.remove('active__cover') : artDOM.classList.remove('active__archive');
        anime({
            targets: artDOM,
            height: '100%',
            duration: 125,
            easing: 'easeInOutCubic',
            complete: function() {
                artDOM.classList.add('smooth');
                artDOM.style.removeProperty('height');
            }
        });
        anime({
            targets: artDOM.getElementsByTagName('h1'),
            opacity: '1',
            translateY: ['-30%', '0%'],
            duration: 500,
            delay: 250,
            easing: 'easeInOutCubic'
        });
        artDOM.style.removeProperty('margin-left');
    }, 900);
    setTimeout(function() {
        artDOM.classList.remove('smooth');
        work.style.removeProperty('transition');
        anime({
            targets: e.srcElement.nextElementSibling.children,
            duration: 500,
            opacity: '1',
            easing: 'linear',
            complete: function() {
                var curr = e.srcElement.nextElementSibling.children;
                var target = Object.keys(curr).map(function(e) {return curr[e]});
                target.forEach(function(curr) {
                    curr.style.removeProperty('opacity');
                });
            }
        });
        anime({
            targets: work,
            opacity: '1',
            duration: 500,
            easing: 'easeInOutCubic',
            complete: function() {
                work.style.removeProperty('opacity');
            }
        });
        work.style.removeProperty('width');
        work.style.removeProperty('margin-left');
        document.getElementById('workHero').classList.remove('active');
    }, 1200);
};
function articleNext(target) {
    var artDOM = document.getElementsByTagName('article')[0];
    var header = document.querySelector('#workHero h1');
    header.style.opacity = '0';
    anime({
        targets: artDOM,
        scrollTop: 0,
        duration: 400,
        easing: 'easeInOutCubic',
        complete: function() {
            text(header);
        }
    });
    function text(header) {
        anime({
            targets: header,
            translateY: ['-30%', '0%'],
            opacity: [0, 1],
            duration: 1000,
            easing: 'easeInOutCubic',
            begin: function() {
                target.scrollIntoView({ behavior: "smooth", block: "center" });
            },
            complete: function() {
                articleInsert(target);
            }
        });
    };
};
//////////////////////////////////////////////////////////
// INITIALIZER
init = function () {
    controllerEvent();
    console.log('Initialized');
}();