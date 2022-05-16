
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function _mergeNamespaces(n, m) {
        m.forEach(function (e) {
            e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
                if (k !== 'default' && !(k in n)) {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        });
        return Object.freeze(n);
    }

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                else
                    this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function fix_and_outro_and_destroy_block(block, lookup) {
        block.f();
        outro_and_destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function notificationsStore(initialValue = []) {
      const store = writable(initialValue);
      const { set, update, subscribe } = store;
      let defaultOptions = {
        duration: 3000,
        placement: 'bottom-right',
        type: 'info',
        theme: 'dark',
      };
      function add(options) {
        const {
          duration = 3000,
          placement = 'bottom-right',
          type = 'info',
          theme = 'dark',
          ...rest
        } = { ...defaultOptions, ...options };

        const uid = Date.now();
        const obj = {
          ...rest,
          uid,
          placement,
          type,
          theme,
          duration,
          remove: () => {
            update((v) => v.filter((i) => i.uid !== uid));
          },
          update: (data) => {
            delete data.uid;
            const index = get_store_value(store)?.findIndex((v) => v?.uid === uid);
            if (index > -1) {
              update((v) => [
                ...v.slice(0, index),
                { ...v[index], ...data },
                ...v.slice(index + 1),
              ]);
            }
          },
        };
        update((v) => [...v, obj]);
        if (duration > 0) {
          setTimeout(() => {
            obj.remove();
            if (typeof obj.onRemove === 'function') obj.onRemove();
          }, duration);
        }
        return obj;
      }

      function getById(uid) {
        return get_store_value(store)?.find((v) => v?.uid === uid);
      }

      function clearAll() {
        set([]);
      }
      function clearLast() {
        update((v) => {
          return v.slice(0, v.length - 1);
        });
      }

      function setDefaults(options) {
        defaultOptions = { ...defaultOptions, ...options };
      }

      return {
        subscribe,
        add,
        success: getHelper('success', add),
        info: getHelper('info', add),
        error: getHelper('error', add),
        warning: getHelper('warning', add),
        clearAll,
        clearLast,
        getById,
        setDefaults,
      };
    }
    const toasts = notificationsStore([]);

    function getHelper(type, add) {
      return function () {
        if (typeof arguments[0] === 'object') {
          const options = arguments[0];
          return add({ ...options, type });
        } else if (
          typeof arguments[0] === 'string' &&
          typeof arguments[1] === 'string'
        ) {
          const options = arguments[2] || {};
          return add({
            ...options,
            type,
            title: arguments[0],
            description: arguments[1],
          });
        } else if (typeof arguments[0] === 'string') {
          const options = arguments[1] || {};
          return add({
            ...options,
            type,
            description: arguments[0],
          });
        }
      };
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    function flip(node, { from, to }, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
        const dx = (from.left + from.width * ox / to.width) - (to.left + ox);
        const dy = (from.top + from.height * oy / to.height) - (to.top + oy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
            easing,
            css: (t, u) => {
                const x = u * dx;
                const y = u * dy;
                const sx = t + u * from.width / to.width;
                const sy = t + u * from.height / to.height;
                return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
            }
        };
    }

    /* node_modules/svelte-toasts/src/ToastContainer.svelte generated by Svelte v3.48.0 */
    const file$h = "node_modules/svelte-toasts/src/ToastContainer.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	return child_ctx;
    }

    const get_default_slot_changes$1 = dirty => ({ data: dirty & /*$toasts*/ 4 });
    const get_default_slot_context$1 = ctx => ({ data: /*toast*/ ctx[14] });

    // (107:10) {:else}
    function create_else_block$8(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context$1);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $toasts*/ 516)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(107:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (105:10) {#if toast.component}
    function create_if_block$9(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*toast*/ ctx[14].component;

    	function switch_props(ctx) {
    		return {
    			props: { data: /*toast*/ ctx[14] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*$toasts*/ 4) switch_instance_changes.data = /*toast*/ ctx[14];

    			if (switch_value !== (switch_value = /*toast*/ ctx[14].component)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(105:10) {#if toast.component}",
    		ctx
    	});

    	return block;
    }

    // (97:6) {#each $toasts         .filter((n) => n.placement === placement)         .reverse() as toast (toast.uid)}
    function create_each_block_1(key_1, ctx) {
    	let li;
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let li_intro;
    	let li_outro;
    	let rect;
    	let stop_animation = noop;
    	let current;
    	const if_block_creators = [create_if_block$9, create_else_block$8];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*toast*/ ctx[14].component) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			li = element("li");
    			if_block.c();
    			t = space();
    			attr_dev(li, "class", "svelte-1rg6zyw");
    			add_location(li, file$h, 99, 8, 2256);
    			this.first = li;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			if_blocks[current_block_type_index].m(li, null);
    			append_dev(li, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(li, t);
    			}
    		},
    		r: function measure() {
    			rect = li.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(li);
    			stop_animation();
    			add_transform(li, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(li, rect, flip, {});
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			add_render_callback(() => {
    				if (li_outro) li_outro.end(1);
    				li_intro = create_in_transition(li, fade, { duration: 500 });
    				li_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (li_intro) li_intro.invalidate();

    			li_outro = create_out_transition(li, fly, {
    				y: /*flyMap*/ ctx[4][/*toast*/ ctx[14].placement],
    				duration: 1000
    			});

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if_blocks[current_block_type_index].d();
    			if (detaching && li_outro) li_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(97:6) {#each $toasts         .filter((n) => n.placement === placement)         .reverse() as toast (toast.uid)}",
    		ctx
    	});

    	return block;
    }

    // (94:0) {#each placements as placement}
    function create_each_block$2(ctx) {
    	let div;
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t;
    	let current;

    	function func(...args) {
    		return /*func*/ ctx[11](/*placement*/ ctx[1], ...args);
    	}

    	let each_value_1 = /*$toasts*/ ctx[2].filter(func).reverse();
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*toast*/ ctx[14].uid;
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			attr_dev(ul, "class", "svelte-1rg6zyw");
    			add_location(ul, file$h, 95, 4, 2131);
    			attr_dev(div, "class", "toast-container " + /*placement*/ ctx[1] + " svelte-1rg6zyw");
    			set_style(div, "width", /*width*/ ctx[0]);
    			add_location(div, file$h, 94, 2, 2062);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*flyMap, $toasts, placements, $$scope*/ 540) {
    				each_value_1 = /*$toasts*/ ctx[2].filter(func).reverse();
    				validate_each_argument(each_value_1);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, ul, fix_and_outro_and_destroy_block, create_each_block_1, null, get_each_context_1);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    				check_outros();
    			}

    			if (!current || dirty & /*width*/ 1) {
    				set_style(div, "width", /*width*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(94:0) {#each placements as placement}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*placements*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*placements, width, $toasts, flyMap, $$scope*/ 541) {
    				each_value = /*placements*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let $toasts;
    	validate_store(toasts, 'toasts');
    	component_subscribe($$self, toasts, $$value => $$invalidate(2, $toasts = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ToastContainer', slots, ['default']);
    	let { theme = 'dark' } = $$props;
    	let { placement = 'bottom-right' } = $$props;
    	let { type = 'info' } = $$props;
    	let { showProgress = false } = $$props;
    	let { duration = 3000 } = $$props;
    	let { width = '320px' } = $$props;

    	/**
     * Default slot which is Toast component/template which will get toast data
     * @slot {{ data: ToastProps }}
     */
    	const placements = [
    		'bottom-right',
    		'bottom-left',
    		'top-right',
    		'top-left',
    		'top-center',
    		'bottom-center',
    		'center-center'
    	];

    	const flyMap = {
    		'bottom-right': 400,
    		'top-right': -400,
    		'bottom-left': 400,
    		'top-left': -400,
    		'bottom-center': 400,
    		'top-center': -400,
    		'center-center': -800
    	};

    	onMount(() => {
    		toasts.setDefaults({
    			placement,
    			showProgress,
    			theme,
    			duration,
    			type
    		});
    	});

    	const writable_props = ['theme', 'placement', 'type', 'showProgress', 'duration', 'width'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ToastContainer> was created with unknown prop '${key}'`);
    	});

    	const func = (placement, n) => n.placement === placement;

    	$$self.$$set = $$props => {
    		if ('theme' in $$props) $$invalidate(5, theme = $$props.theme);
    		if ('placement' in $$props) $$invalidate(1, placement = $$props.placement);
    		if ('type' in $$props) $$invalidate(6, type = $$props.type);
    		if ('showProgress' in $$props) $$invalidate(7, showProgress = $$props.showProgress);
    		if ('duration' in $$props) $$invalidate(8, duration = $$props.duration);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('$$scope' in $$props) $$invalidate(9, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fly,
    		fade,
    		onMount,
    		flip,
    		toasts,
    		theme,
    		placement,
    		type,
    		showProgress,
    		duration,
    		width,
    		placements,
    		flyMap,
    		$toasts
    	});

    	$$self.$inject_state = $$props => {
    		if ('theme' in $$props) $$invalidate(5, theme = $$props.theme);
    		if ('placement' in $$props) $$invalidate(1, placement = $$props.placement);
    		if ('type' in $$props) $$invalidate(6, type = $$props.type);
    		if ('showProgress' in $$props) $$invalidate(7, showProgress = $$props.showProgress);
    		if ('duration' in $$props) $$invalidate(8, duration = $$props.duration);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		width,
    		placement,
    		$toasts,
    		placements,
    		flyMap,
    		theme,
    		type,
    		showProgress,
    		duration,
    		$$scope,
    		slots,
    		func
    	];
    }

    class ToastContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {
    			theme: 5,
    			placement: 1,
    			type: 6,
    			showProgress: 7,
    			duration: 8,
    			width: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToastContainer",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get theme() {
    		throw new Error("<ToastContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set theme(value) {
    		throw new Error("<ToastContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placement() {
    		throw new Error("<ToastContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placement(value) {
    		throw new Error("<ToastContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<ToastContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<ToastContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showProgress() {
    		throw new Error("<ToastContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showProgress(value) {
    		throw new Error("<ToastContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<ToastContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<ToastContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<ToastContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<ToastContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /* node_modules/svelte-toasts/src/FlatToast.svelte generated by Svelte v3.48.0 */
    const file$g = "node_modules/svelte-toasts/src/FlatToast.svelte";
    const get_close_icon_slot_changes = dirty => ({});
    const get_close_icon_slot_context = ctx => ({});
    const get_extra_slot_changes = dirty => ({});
    const get_extra_slot_context = ctx => ({});
    const get_icon_slot_changes = dirty => ({});
    const get_icon_slot_context = ctx => ({});

    // (92:4) {:else}
    function create_else_block$7(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M9.2,5h1.5v7H9.2V5z M10,16c-0.6,0-1-0.4-1-1s0.4-1,1-1\ts1,0.4,1,1S10.6,16,10,16z");
    			add_location(path0, file$g, 99, 9, 2534);
    			attr_dev(path1, "d", "M9.2,5h1.5v7H9.2V5z M10,16c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S10.6,16,10,16z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$g, 101, 10, 2690);
    			attr_dev(svg, "class", "st-toast-icon svelte-is9c7e");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$g, 92, 6, 2353);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(92:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (76:36) 
    function create_if_block_4$1(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z");
    			add_location(path0, file$g, 83, 9, 2085);
    			attr_dev(path1, "d", "M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$g, 85, 10, 2196);
    			attr_dev(svg, "class", "st-toast-icon svelte-is9c7e");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$g, 76, 6, 1904);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(76:36) ",
    		ctx
    	});

    	return block;
    }

    // (64:35) 
    function create_if_block_3$2(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm0,5a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,16,7Zm4,17.12H12V21.88h2.88V15.12H13V12.88h4.13v9H20Z");
    			add_location(path, file$g, 71, 9, 1681);
    			attr_dev(svg, "class", "st-toast-icon svelte-is9c7e");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 32 32");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$g, 64, 6, 1500);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(64:35) ",
    		ctx
    	});

    	return block;
    }

    // (45:4) {#if data.type === 'success'}
    function create_if_block_2$2(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M10,1c-4.9,0-9,4.1-9,9s4.1,9,9,9s9-4,9-9S15,1,10,1z M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z");
    			add_location(path0, file$g, 53, 8, 1135);
    			attr_dev(path1, "fill", "none");
    			attr_dev(path1, "d", "M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$g, 56, 8, 1279);
    			attr_dev(svg, "class", "st-toast-icon svelte-is9c7e");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$g, 45, 6, 947);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(45:4) {#if data.type === 'success'}",
    		ctx
    	});

    	return block;
    }

    // (44:20)      
    function fallback_block_1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*data*/ ctx[1].type === 'success') return create_if_block_2$2;
    		if (/*data*/ ctx[1].type === 'info') return create_if_block_3$2;
    		if (/*data*/ ctx[1].type === 'error') return create_if_block_4$1;
    		return create_else_block$7;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(44:20)      ",
    		ctx
    	});

    	return block;
    }

    // (112:4) {#if data.title}
    function create_if_block_1$3(ctx) {
    	let h3;
    	let t_value = /*data*/ ctx[1].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = text(t_value);
    			attr_dev(h3, "class", "st-toast-title svelte-is9c7e");
    			add_location(h3, file$g, 112, 6, 2954);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 2 && t_value !== (t_value = /*data*/ ctx[1].title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(112:4) {#if data.title}",
    		ctx
    	});

    	return block;
    }

    // (127:28)        
    function fallback_block(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z");
    			add_location(path, file$g, 135, 8, 3504);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "bx--toast-notification__close-icon svelte-is9c7e");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 32 32");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$g, 127, 6, 3295);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(127:28)        ",
    		ctx
    	});

    	return block;
    }

    // (142:2) {#if data.showProgress}
    function create_if_block$8(ctx) {
    	let progress_1;

    	const block = {
    		c: function create() {
    			progress_1 = element("progress");
    			set_style(progress_1, "height", /*data*/ ctx[1].duration > 0 ? '4px' : 0);
    			progress_1.value = /*$progress*/ ctx[2];
    			attr_dev(progress_1, "class", "svelte-is9c7e");
    			add_location(progress_1, file$g, 142, 4, 3699);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, progress_1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 2) {
    				set_style(progress_1, "height", /*data*/ ctx[1].duration > 0 ? '4px' : 0);
    			}

    			if (dirty & /*$progress*/ 4) {
    				prop_dev(progress_1, "value", /*$progress*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(progress_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(142:2) {#if data.showProgress}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let div2;
    	let t0;
    	let div1;
    	let t1;
    	let p;
    	let t2_value = /*data*/ ctx[1].description + "";
    	let t2;
    	let t3;
    	let div0;
    	let t4;
    	let button;
    	let t5;
    	let div2_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const icon_slot_template = /*#slots*/ ctx[7].icon;
    	const icon_slot = create_slot(icon_slot_template, ctx, /*$$scope*/ ctx[6], get_icon_slot_context);
    	const icon_slot_or_fallback = icon_slot || fallback_block_1(ctx);
    	let if_block0 = /*data*/ ctx[1].title && create_if_block_1$3(ctx);
    	const extra_slot_template = /*#slots*/ ctx[7].extra;
    	const extra_slot = create_slot(extra_slot_template, ctx, /*$$scope*/ ctx[6], get_extra_slot_context);
    	const close_icon_slot_template = /*#slots*/ ctx[7]["close-icon"];
    	const close_icon_slot = create_slot(close_icon_slot_template, ctx, /*$$scope*/ ctx[6], get_close_icon_slot_context);
    	const close_icon_slot_or_fallback = close_icon_slot || fallback_block(ctx);
    	let if_block1 = /*data*/ ctx[1].showProgress && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			if (icon_slot_or_fallback) icon_slot_or_fallback.c();
    			t0 = space();
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t1 = space();
    			p = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			div0 = element("div");
    			if (extra_slot) extra_slot.c();
    			t4 = space();
    			button = element("button");
    			if (close_icon_slot_or_fallback) close_icon_slot_or_fallback.c();
    			t5 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(p, "class", "st-toast-description svelte-is9c7e");
    			add_location(p, file$g, 115, 4, 3014);
    			attr_dev(div0, "class", "st-toast-extra");
    			add_location(div0, file$g, 116, 4, 3073);
    			attr_dev(div1, "class", "st-toast-details svelte-is9c7e");
    			add_location(div1, file$g, 110, 2, 2896);
    			attr_dev(button, "class", "st-toast-close-btn svelte-is9c7e");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "aria-label", "close");
    			add_location(button, file$g, 120, 2, 3152);
    			attr_dev(div2, "class", div2_class_value = "st-toast flat " + (/*data*/ ctx[1].theme || /*theme*/ ctx[0]) + " " + (/*data*/ ctx[1].type || 'info') + " svelte-is9c7e");
    			attr_dev(div2, "role", "alert");
    			attr_dev(div2, "aria-live", "assertive");
    			attr_dev(div2, "aria-atomic", "true");
    			add_location(div2, file$g, 36, 0, 730);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);

    			if (icon_slot_or_fallback) {
    				icon_slot_or_fallback.m(div2, null);
    			}

    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, p);
    			append_dev(p, t2);
    			append_dev(div1, t3);
    			append_dev(div1, div0);

    			if (extra_slot) {
    				extra_slot.m(div0, null);
    			}

    			append_dev(div2, t4);
    			append_dev(div2, button);

    			if (close_icon_slot_or_fallback) {
    				close_icon_slot_or_fallback.m(button, null);
    			}

    			append_dev(div2, t5);
    			if (if_block1) if_block1.m(div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*onRemove*/ ctx[4], false, false, false),
    					listen_dev(div2, "click", /*onClick*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (icon_slot) {
    				if (icon_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						icon_slot,
    						icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(icon_slot_template, /*$$scope*/ ctx[6], dirty, get_icon_slot_changes),
    						get_icon_slot_context
    					);
    				}
    			} else {
    				if (icon_slot_or_fallback && icon_slot_or_fallback.p && (!current || dirty & /*data*/ 2)) {
    					icon_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			if (/*data*/ ctx[1].title) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$3(ctx);
    					if_block0.c();
    					if_block0.m(div1, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if ((!current || dirty & /*data*/ 2) && t2_value !== (t2_value = /*data*/ ctx[1].description + "")) set_data_dev(t2, t2_value);

    			if (extra_slot) {
    				if (extra_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						extra_slot,
    						extra_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(extra_slot_template, /*$$scope*/ ctx[6], dirty, get_extra_slot_changes),
    						get_extra_slot_context
    					);
    				}
    			}

    			if (close_icon_slot) {
    				if (close_icon_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						close_icon_slot,
    						close_icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(close_icon_slot_template, /*$$scope*/ ctx[6], dirty, get_close_icon_slot_changes),
    						get_close_icon_slot_context
    					);
    				}
    			}

    			if (/*data*/ ctx[1].showProgress) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$8(ctx);
    					if_block1.c();
    					if_block1.m(div2, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (!current || dirty & /*data, theme*/ 3 && div2_class_value !== (div2_class_value = "st-toast flat " + (/*data*/ ctx[1].theme || /*theme*/ ctx[0]) + " " + (/*data*/ ctx[1].type || 'info') + " svelte-is9c7e")) {
    				attr_dev(div2, "class", div2_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_slot_or_fallback, local);
    			transition_in(extra_slot, local);
    			transition_in(close_icon_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_slot_or_fallback, local);
    			transition_out(extra_slot, local);
    			transition_out(close_icon_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (icon_slot_or_fallback) icon_slot_or_fallback.d(detaching);
    			if (if_block0) if_block0.d();
    			if (extra_slot) extra_slot.d(detaching);
    			if (close_icon_slot_or_fallback) close_icon_slot_or_fallback.d(detaching);
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let $progress;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FlatToast', slots, ['icon','extra','close-icon']);
    	let { theme = 'light' } = $$props;
    	let { data = {} } = $$props;
    	const progress = tweened(1, { duration: data.duration, easing: identity });
    	validate_store(progress, 'progress');
    	component_subscribe($$self, progress, value => $$invalidate(2, $progress = value));

    	onMount(() => {
    		progress.set(0, { duration: data.duration });
    	});

    	const onRemove = e => {
    		e.stopPropagation();
    		data.remove();
    		if (typeof data.onRemove === 'function') data.onRemove();
    	};

    	const onClick = () => {
    		if (typeof data.onClick === 'function') data.onClick();
    	};

    	const writable_props = ['theme', 'data'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FlatToast> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    		if ('$$scope' in $$props) $$invalidate(6, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		tweened,
    		linear: identity,
    		theme,
    		data,
    		progress,
    		onRemove,
    		onClick,
    		$progress
    	});

    	$$self.$inject_state = $$props => {
    		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [theme, data, $progress, progress, onRemove, onClick, $$scope, slots];
    }

    class FlatToast extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { theme: 0, data: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FlatToast",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get theme() {
    		throw new Error("<FlatToast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set theme(value) {
    		throw new Error("<FlatToast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<FlatToast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<FlatToast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const FLAG_ALLOW_MOBILE = writable(false); // 모바일 기기 접속 허용 여부 플래그
    const FLAG_YT_SEARCH_POPUP = writable(false); // YouTube 음원 추가 팝업 플래그
    const FLAG_LOCAL_SEARCH_POPUP = writable(false); // Local 음원파일 추가 팝업 플래그
    const FLAG_LOADING_SCREEN_SAVER = writable(false); // 로딩 스크린 세이버 플래그
    const FLAG_HISTORY_LIST = writable(false); // History List 토글 플래그
    const FLAG_PROTECTOR = writable(false); // 서비스 보호화면 활성화 플래그
    const FLAG_PLAYING = writable(false); // 재생 여부 플래그
    const FLAG_PLAYER_IS_READY = writable(false); // YouTube iframe의 Video on ready 여부 플래그
    const FLAG_PLAYER_IS_BUFFERING = writable(false); // YouTube iframe의 Video on buffering 여부 플래그
    const FLAG_NEXT_SONG_LOADING = writable(false); // 재생 대기열 내의 다음곡을 로딩중인지 여부 플래그
    const FLAG_ON_CHANGE_VOLUME = writable(false); // Player Volume 조절 중인 여부 플래그
    const FLAG_ON_CHANGE_CURRENT_TIME = writable(false); // Player currentTime 조절 중인 여부 플래그
    const FLAG_PLAYER_IS_RUNNING = writable(false); // Player에서 영상이 재생중인지 여부 플래그
    const FLAG_NETWORK_STATUS = writable(false); // 네트워크 연결 상태 플래그
    const FLAG_CLIENT_STATUS = writable(false); // STREAM-MUSIC 클라이언트 연결 상태 플래그
    const LOADING_SCREEN_SAVER_MSG = writable(""); // 로딩 스크린 세이버 메세지
    const YT_VIDEO_ID = writable(""); // YouTube iframe Video ID
    const LOCAL_SONG_PATH = writable(""); // 로컬 음원 파일 경로
    const PLAYER_ELEMENT = writable({}); // 플레이어 조작 객체
    const PROTECTOR_CONTENT = writable(""); // 서비스 보호화면 활성화 플래그
    const PLAYER_VOLUME = writable(0); // 플레이어 볼륨 값
    const PLAYER_CURRENT_TIME = writable(0); // 플레이어 현재 재생 시간
    const PLAYER_DURATION = writable("00:00"); // 플레이어 총 재생 길이
    const PLAYLIST = writable({
        // 현재재생곡, 재생대기열, 히스로리 객체
        currentSong: null,
        queue: [],
        history: [],
    });

    /* src/components/common/LoadingScreenSaver.svelte generated by Svelte v3.48.0 */
    const file$f = "src/components/common/LoadingScreenSaver.svelte";

    function create_fragment$i(ctx) {
    	let div1;
    	let div0;
    	let span;
    	let t0;
    	let t1;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			t0 = text(/*$LOADING_SCREEN_SAVER_MSG*/ ctx[0]);
    			t1 = space();
    			img = element("img");
    			attr_dev(span, "class", "msg svelte-1a23iik");
    			add_location(span, file$f, 5, 4, 133);
    			attr_dev(img, "class", "loading-icon svelte-1a23iik");
    			if (!src_url_equal(img.src, img_src_value = "img/loading-icon.gif")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$f, 6, 4, 190);
    			attr_dev(div0, "class", "dialog svelte-1a23iik");
    			add_location(div0, file$f, 4, 2, 108);
    			attr_dev(div1, "id", "screen-saver");
    			attr_dev(div1, "class", "svelte-1a23iik");
    			add_location(div1, file$f, 3, 0, 82);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(span, t0);
    			append_dev(div0, t1);
    			append_dev(div0, img);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$LOADING_SCREEN_SAVER_MSG*/ 1) set_data_dev(t0, /*$LOADING_SCREEN_SAVER_MSG*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let $LOADING_SCREEN_SAVER_MSG;
    	validate_store(LOADING_SCREEN_SAVER_MSG, 'LOADING_SCREEN_SAVER_MSG');
    	component_subscribe($$self, LOADING_SCREEN_SAVER_MSG, $$value => $$invalidate(0, $LOADING_SCREEN_SAVER_MSG = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LoadingScreenSaver', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LoadingScreenSaver> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		LOADING_SCREEN_SAVER_MSG,
    		$LOADING_SCREEN_SAVER_MSG
    	});

    	return [$LOADING_SCREEN_SAVER_MSG];
    }

    class LoadingScreenSaver extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoadingScreenSaver",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* node_modules/svelte-media-query/src/MediaQuery.svelte generated by Svelte v3.48.0 */
    const get_default_slot_changes = dirty => ({ matches: dirty & /*matches*/ 1 });
    const get_default_slot_context = ctx => ({ matches: /*matches*/ ctx[0] });

    function create_fragment$h(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, matches*/ 9)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MediaQuery', slots, ['default']);
    	let { query } = $$props;
    	let mql;
    	let mqlListener;
    	let wasMounted = false;
    	let matches = false;

    	onMount(() => {
    		$$invalidate(2, wasMounted = true);

    		return () => {
    			removeActiveListener();
    		};
    	});

    	function addNewListener(query) {
    		mql = window.matchMedia(query);
    		mqlListener = v => $$invalidate(0, matches = v.matches);

    		mql.addEventListener
    		? mql.addEventListener("change", mqlListener)
    		: mql.addListener(mqlListener);

    		$$invalidate(0, matches = mql.matches);
    	}

    	function removeActiveListener() {
    		if (mql && mqlListener) {
    			mql.removeEventListener
    			? mql.removeEventListener("change", mqlListener)
    			: mql.removeListener(mqlListener);
    		}
    	}

    	const writable_props = ['query'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MediaQuery> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('query' in $$props) $$invalidate(1, query = $$props.query);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		query,
    		mql,
    		mqlListener,
    		wasMounted,
    		matches,
    		addNewListener,
    		removeActiveListener
    	});

    	$$self.$inject_state = $$props => {
    		if ('query' in $$props) $$invalidate(1, query = $$props.query);
    		if ('mql' in $$props) mql = $$props.mql;
    		if ('mqlListener' in $$props) mqlListener = $$props.mqlListener;
    		if ('wasMounted' in $$props) $$invalidate(2, wasMounted = $$props.wasMounted);
    		if ('matches' in $$props) $$invalidate(0, matches = $$props.matches);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*wasMounted, query*/ 6) {
    			{
    				if (wasMounted) {
    					removeActiveListener();
    					addNewListener(query);
    				}
    			}
    		}
    	};

    	return [matches, query, wasMounted, $$scope, slots];
    }

    class MediaQuery extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { query: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MediaQuery",
    			options,
    			id: create_fragment$h.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*query*/ ctx[1] === undefined && !('query' in props)) {
    			console.warn("<MediaQuery> was created without expected prop 'query'");
    		}
    	}

    	get query() {
    		throw new Error("<MediaQuery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set query(value) {
    		throw new Error("<MediaQuery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/common/Btn.svelte generated by Svelte v3.48.0 */
    const file$e = "src/components/common/Btn.svelte";

    // (12:4) {:else}
    function create_else_block$6(ctx) {
    	let html_tag;

    	let raw_value = (/*minLabel*/ ctx[1] === ""
    	? /*defaultLabel*/ ctx[0]
    	: /*minLabel*/ ctx[1]) + "";

    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*minLabel, defaultLabel*/ 3 && raw_value !== (raw_value = (/*minLabel*/ ctx[1] === ""
    			? /*defaultLabel*/ ctx[0]
    			: /*minLabel*/ ctx[1]) + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(12:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (10:4) {#if matches}
    function create_if_block$7(ctx) {
    	let html_tag;
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*defaultLabel*/ ctx[0], target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*defaultLabel*/ 1) html_tag.p(/*defaultLabel*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(10:4) {#if matches}",
    		ctx
    	});

    	return block;
    }

    // (9:2) <MediaQuery query="(min-width: 800px)" let:matches>
    function create_default_slot$3(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*matches*/ ctx[4]) return create_if_block$7;
    		return create_else_block$6;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(9:2) <MediaQuery query=\\\"(min-width: 800px)\\\" let:matches>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div;
    	let mediaquery;
    	let current;
    	let mounted;
    	let dispose;

    	mediaquery = new MediaQuery({
    			props: {
    				query: "(min-width: 800px)",
    				$$slots: {
    					default: [
    						create_default_slot$3,
    						({ matches }) => ({ 4: matches }),
    						({ matches }) => matches ? 16 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(mediaquery.$$.fragment);
    			attr_dev(div, "class", "btn svelte-lpp6lr");
    			attr_dev(div, "data-tooltip", /*tooltip*/ ctx[2]);
    			add_location(div, file$e, 7, 0, 170);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(mediaquery, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					div,
    					"click",
    					function () {
    						if (is_function(/*onClick*/ ctx[3])) /*onClick*/ ctx[3].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const mediaquery_changes = {};

    			if (dirty & /*$$scope, defaultLabel, matches, minLabel*/ 51) {
    				mediaquery_changes.$$scope = { dirty, ctx };
    			}

    			mediaquery.$set(mediaquery_changes);

    			if (!current || dirty & /*tooltip*/ 4) {
    				attr_dev(div, "data-tooltip", /*tooltip*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mediaquery.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mediaquery.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(mediaquery);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Btn', slots, []);
    	let { defaultLabel } = $$props;
    	let { minLabel = "" } = $$props;
    	let { tooltip = "" } = $$props;
    	let { onClick } = $$props;
    	const writable_props = ['defaultLabel', 'minLabel', 'tooltip', 'onClick'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Btn> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('defaultLabel' in $$props) $$invalidate(0, defaultLabel = $$props.defaultLabel);
    		if ('minLabel' in $$props) $$invalidate(1, minLabel = $$props.minLabel);
    		if ('tooltip' in $$props) $$invalidate(2, tooltip = $$props.tooltip);
    		if ('onClick' in $$props) $$invalidate(3, onClick = $$props.onClick);
    	};

    	$$self.$capture_state = () => ({
    		MediaQuery,
    		defaultLabel,
    		minLabel,
    		tooltip,
    		onClick
    	});

    	$$self.$inject_state = $$props => {
    		if ('defaultLabel' in $$props) $$invalidate(0, defaultLabel = $$props.defaultLabel);
    		if ('minLabel' in $$props) $$invalidate(1, minLabel = $$props.minLabel);
    		if ('tooltip' in $$props) $$invalidate(2, tooltip = $$props.tooltip);
    		if ('onClick' in $$props) $$invalidate(3, onClick = $$props.onClick);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [defaultLabel, minLabel, tooltip, onClick];
    }

    class Btn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			defaultLabel: 0,
    			minLabel: 1,
    			tooltip: 2,
    			onClick: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Btn",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*defaultLabel*/ ctx[0] === undefined && !('defaultLabel' in props)) {
    			console.warn("<Btn> was created without expected prop 'defaultLabel'");
    		}

    		if (/*onClick*/ ctx[3] === undefined && !('onClick' in props)) {
    			console.warn("<Btn> was created without expected prop 'onClick'");
    		}
    	}

    	get defaultLabel() {
    		throw new Error("<Btn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set defaultLabel(value) {
    		throw new Error("<Btn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get minLabel() {
    		throw new Error("<Btn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set minLabel(value) {
    		throw new Error("<Btn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tooltip() {
    		throw new Error("<Btn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tooltip(value) {
    		throw new Error("<Btn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClick() {
    		throw new Error("<Btn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClick(value) {
    		throw new Error("<Btn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/common/Indicator.svelte generated by Svelte v3.48.0 */

    const file$d = "src/components/common/Indicator.svelte";

    function create_fragment$f(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "indicator svelte-1simiog");
    			toggle_class(div, "green", /*state*/ ctx[0]);
    			toggle_class(div, "red", !/*state*/ ctx[0]);
    			add_location(div, file$d, 3, 0, 47);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*state*/ 1) {
    				toggle_class(div, "green", /*state*/ ctx[0]);
    			}

    			if (dirty & /*state*/ 1) {
    				toggle_class(div, "red", !/*state*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Indicator', slots, []);
    	let { state } = $$props;
    	const writable_props = ['state'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Indicator> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('state' in $$props) $$invalidate(0, state = $$props.state);
    	};

    	$$self.$capture_state = () => ({ state });

    	$$self.$inject_state = $$props => {
    		if ('state' in $$props) $$invalidate(0, state = $$props.state);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [state];
    }

    class Indicator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { state: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Indicator",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*state*/ ctx[0] === undefined && !('state' in props)) {
    			console.warn("<Indicator> was created without expected prop 'state'");
    		}
    	}

    	get state() {
    		throw new Error("<Indicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Indicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/common/Protector.svelte generated by Svelte v3.48.0 */
    const file$c = "src/components/common/Protector.svelte";

    // (9:0) {:else}
    function create_else_block$5(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(9:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (4:0) {#if $FLAG_PROTECTOR && !$FLAG_ALLOW_MOBILE}
    function create_if_block$6(ctx) {
    	let div1;
    	let html_tag;
    	let t0;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			html_tag = new HtmlTag(false);
    			t0 = space();
    			div0 = element("div");
    			div0.textContent = "STREAM-MUSIC";
    			html_tag.a = t0;
    			attr_dev(div0, "class", "block svelte-1aicxnt");
    			add_location(div0, file$c, 6, 4, 217);
    			attr_dev(div1, "class", "protector svelte-1aicxnt");
    			add_location(div1, file$c, 4, 2, 158);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			html_tag.m(/*$PROTECTOR_CONTENT*/ ctx[2], div1);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$PROTECTOR_CONTENT*/ 4) html_tag.p(/*$PROTECTOR_CONTENT*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(4:0) {#if $FLAG_PROTECTOR && !$FLAG_ALLOW_MOBILE}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$6, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$FLAG_PROTECTOR*/ ctx[0] && !/*$FLAG_ALLOW_MOBILE*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let $FLAG_PROTECTOR;
    	let $FLAG_ALLOW_MOBILE;
    	let $PROTECTOR_CONTENT;
    	validate_store(FLAG_PROTECTOR, 'FLAG_PROTECTOR');
    	component_subscribe($$self, FLAG_PROTECTOR, $$value => $$invalidate(0, $FLAG_PROTECTOR = $$value));
    	validate_store(FLAG_ALLOW_MOBILE, 'FLAG_ALLOW_MOBILE');
    	component_subscribe($$self, FLAG_ALLOW_MOBILE, $$value => $$invalidate(1, $FLAG_ALLOW_MOBILE = $$value));
    	validate_store(PROTECTOR_CONTENT, 'PROTECTOR_CONTENT');
    	component_subscribe($$self, PROTECTOR_CONTENT, $$value => $$invalidate(2, $PROTECTOR_CONTENT = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Protector', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Protector> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		FLAG_ALLOW_MOBILE,
    		FLAG_PROTECTOR,
    		PROTECTOR_CONTENT,
    		$FLAG_PROTECTOR,
    		$FLAG_ALLOW_MOBILE,
    		$PROTECTOR_CONTENT
    	});

    	return [$FLAG_PROTECTOR, $FLAG_ALLOW_MOBILE, $PROTECTOR_CONTENT, $$scope, slots];
    }

    class Protector extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Protector",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    const successToast = (msg) => {
        toasts.add({
            title: "Success",
            description: msg,
            duration: 3000,
            placement: "top-right",
            type: "success",
            theme: "light",
            showProgress: true,
            onClick: () => { },
            onRemove: () => { },
        });
    };
    const infoToast = (msg) => {
        toasts.add({
            title: "Info",
            description: msg,
            duration: 3000,
            placement: "top-right",
            type: "info",
            theme: "light",
            showProgress: true,
            onClick: () => { },
            onRemove: () => { },
        });
    };
    const errorToast = (msg) => {
        toasts.add({
            title: "Error",
            description: msg,
            duration: 3000,
            placement: "top-right",
            type: "error",
            theme: "light",
            showProgress: true,
            onClick: () => { },
            onRemove: () => { },
        });
    };

    /**
     * PLAYLIST 객체를 trigging Subscriber하고 LocalStorage에 저장하는 함수
     */
    const savePlayList = () => {
        PLAYLIST.set(get_store_value(PLAYLIST));
        localStorage.setItem("streamMusicPlayList", btoa(unescape(encodeURIComponent(JSON.stringify(get_store_value(PLAYLIST))))));
    };
    /**
     * 재생을 중지하는 함수
     * @param pause 재생상태 여부, true: 재생, false: 일시정지
     */
    const stopSong = (pause = false) => {
        const currentSong = get_store_value(PLAYLIST).currentSong;
        if (currentSong !== null) {
            if (get_store_value(PLAYLIST).history.length == 50)
                get_store_value(PLAYLIST).history.splice(49, 1); // 히스토리는 최대 50개까지만 저장
            get_store_value(PLAYLIST).history.unshift(currentSong);
        }
        get_store_value(PLAYLIST).currentSong = null;
        YT_VIDEO_ID.set("");
        LOCAL_SONG_PATH.set("");
        FLAG_PLAYING.set(pause);
        PLAYER_ELEMENT.set({});
        FLAG_PLAYER_IS_READY.set(false);
        PLAYER_CURRENT_TIME.set(0);
        PLAYER_DURATION.set("00:00");
        FLAG_PLAYER_IS_RUNNING.set(false);
        savePlayList();
    };
    /**
     * 재생대기열의 첫번째 노래를 재생하는 함수
     * @param pause 재생상태 여부, true: 재생, false: 일시정지
     */
    const playSong = (pause) => {
        var _a, _b;
        FLAG_PLAYER_IS_RUNNING.set(false);
        FLAG_PLAYING.set(pause);
        const currentSong = get_store_value(PLAYLIST).currentSong;
        if (currentSong === null) {
            // 현재 재생중인 노래가 없는 상태에서 재생을 시작하는 경우
            switch (get_store_value(PLAYLIST).queue[0].type) {
                case "youtube":
                    if (get_store_value(FLAG_NETWORK_STATUS))
                        YT_VIDEO_ID.set(get_store_value(PLAYLIST).queue[0].songId);
                    else {
                        FLAG_PLAYING.set(false);
                        errorToast("YouTube 음원 재생을 위해 네트워크 연결이 필요합니다.");
                        return;
                    }
                    break;
                case "local":
                    LOCAL_SONG_PATH.set(get_store_value(PLAYLIST).queue[0].songId);
                    break;
            }
            get_store_value(PLAYLIST).currentSong = get_store_value(PLAYLIST).queue[0];
            get_store_value(PLAYLIST).queue.shift();
            savePlayList();
            infoToast(`Now Playing: ${(_a = get_store_value(PLAYLIST).currentSong) === null || _a === void 0 ? void 0 : _a.title} - ${(_b = get_store_value(PLAYLIST).currentSong) === null || _b === void 0 ? void 0 : _b.artist}`);
        }
        else {
            // 현재 재생중인 노래가 있는 경우
            switch (currentSong.type) {
                case "youtube":
                    const interval = setInterval(() => {
                        if (get_store_value(FLAG_PLAYER_IS_READY)) {
                            get_store_value(PLAYER_ELEMENT).playVideo();
                            clearInterval(interval);
                        }
                    }, 10);
                    break;
            }
        }
    };
    /**
     * 재생대기열 내의 다음곡을 재생하는 함수
     * @param pause 재생상태 여부, true: 재생, false: 일시정지
     */
    const fowardSong = (pause) => {
        if (!get_store_value(FLAG_NEXT_SONG_LOADING)) {
            FLAG_NEXT_SONG_LOADING.set(true);
            stopSong();
            if (get_store_value(PLAYLIST).queue.length !== 0) {
                setTimeout(() => {
                    playSong(pause);
                }, 500);
            }
        }
    };
    /**
     * 초(second)를 "mm:ss" 형식으로 변환하는 함수
     * @param sec
     */
    const getDurationNumToStr = (sec) => {
        const M = Math.floor(sec / 60);
        const S = Math.floor(sec - M * 60);
        const durationM = String(M).padStart(2, "0");
        const durationS = String(S).padStart(2, "0");
        return `${durationM}:${durationS}`;
    };
    /**
     * 초(second)를 "mm:ss" 형식으로 변환하는 함수
     * @param sec
     */
    const getDurationStrToNum = (str) => {
        return parseInt(str.split(":")[0]) * 60 + parseInt(str.split(":")[1]);
    };

    /* src/components/common/Slider.svelte generated by Svelte v3.48.0 */

    const file$b = "src/components/common/Slider.svelte";

    function create_fragment$d(ctx) {
    	let input;
    	let input_step_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_style(input, "width", /*option*/ ctx[3].trackWidth);
    			attr_dev(input, "type", "range");
    			attr_dev(input, "class", "slider svelte-1jj2d8g");
    			attr_dev(input, "step", input_step_value = /*option*/ ctx[3].step);
    			attr_dev(input, "min", /*min*/ ctx[1]);
    			attr_dev(input, "max", /*max*/ ctx[2]);
    			add_location(input, file$b, 15, 0, 332);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_input_handler*/ ctx[4]),
    					listen_dev(input, "input", /*input_change_input_handler*/ ctx[4]),
    					listen_dev(
    						input,
    						"change",
    						function () {
    							if (is_function(/*option*/ ctx[3].onChange)) /*option*/ ctx[3].onChange.apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						input,
    						"mousedown",
    						function () {
    							if (is_function(/*option*/ ctx[3].onMouseDown)) /*option*/ ctx[3].onMouseDown.apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						input,
    						"mouseup",
    						function () {
    							if (is_function(/*option*/ ctx[3].onMouseUp)) /*option*/ ctx[3].onMouseUp.apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*option*/ 8) {
    				set_style(input, "width", /*option*/ ctx[3].trackWidth);
    			}

    			if (dirty & /*option*/ 8 && input_step_value !== (input_step_value = /*option*/ ctx[3].step)) {
    				attr_dev(input, "step", input_step_value);
    			}

    			if (dirty & /*min*/ 2) {
    				attr_dev(input, "min", /*min*/ ctx[1]);
    			}

    			if (dirty & /*max*/ 4) {
    				attr_dev(input, "max", /*max*/ ctx[2]);
    			}

    			if (dirty & /*value*/ 1) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Slider', slots, []);
    	let { min = 0 } = $$props;
    	let { max = 100 } = $$props;
    	let { value = 0 } = $$props;

    	let { option = {
    		thumbColor: "#ff3e00",
    		trackColor: "#ccc",
    		progressColor: "#ff835c",
    		trackWidth: "100%",
    		step: 0.0000000000000001,
    		onChange: () => {
    			
    		},
    		onMouseUp: () => {
    			
    		},
    		onMouseDown: () => {
    			
    		}
    	} } = $$props;

    	const writable_props = ['min', 'max', 'value', 'option'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Slider> was created with unknown prop '${key}'`);
    	});

    	function input_change_input_handler() {
    		value = to_number(this.value);
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ('min' in $$props) $$invalidate(1, min = $$props.min);
    		if ('max' in $$props) $$invalidate(2, max = $$props.max);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('option' in $$props) $$invalidate(3, option = $$props.option);
    	};

    	$$self.$capture_state = () => ({ min, max, value, option });

    	$$self.$inject_state = $$props => {
    		if ('min' in $$props) $$invalidate(1, min = $$props.min);
    		if ('max' in $$props) $$invalidate(2, max = $$props.max);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('option' in $$props) $$invalidate(3, option = $$props.option);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, min, max, option, input_change_input_handler];
    }

    class Slider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { min: 1, max: 2, value: 0, option: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Slider",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get min() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get option() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set option(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/PlayerApp/SongControl.svelte generated by Svelte v3.48.0 */
    const file$a = "src/components/PlayerApp/SongControl.svelte";

    // (85:4) {:else}
    function create_else_block$4(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM224 191.1v128C224 337.7 209.7 352 192 352S160 337.7 160 320V191.1C160 174.3 174.3 160 191.1 160S224 174.3 224 191.1zM352 191.1v128C352 337.7 337.7 352 320 352S288 337.7 288 320V191.1C288 174.3 302.3 160 319.1 160S352 174.3 352 191.1z");
    			add_location(path, file$a, 89, 9, 2944);
    			attr_dev(svg, "class", "icon pause svelte-1shfip3");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file$a, 85, 6, 2830);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(85:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (76:4) {#if !$FLAG_PLAYING}
    function create_if_block$5(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM176 168V344C176 352.7 180.7 360.7 188.3 364.9C195.8 369.2 205.1 369 212.5 364.5L356.5 276.5C363.6 272.1 368 264.4 368 256C368 247.6 363.6 239.9 356.5 235.5L212.5 147.5C205.1 142.1 195.8 142.8 188.3 147.1C180.7 151.3 176 159.3 176 168V168z");
    			add_location(path, file$a, 80, 9, 2419);
    			attr_dev(svg, "class", "icon play svelte-1shfip3");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file$a, 76, 6, 2306);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(76:4) {#if !$FLAG_PLAYING}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div6;
    	let div0;
    	let t0;
    	let div1;
    	let svg0;
    	let path0;
    	let t1;
    	let div2;
    	let svg1;
    	let path1;
    	let t2;
    	let div5;
    	let div3;
    	let span0;
    	let t3;
    	let t4;
    	let slider0;
    	let updating_value;
    	let updating_max;
    	let t5;
    	let span1;
    	let t6;
    	let t7;
    	let div4;
    	let svg2;
    	let path2;
    	let t8;
    	let svg3;
    	let path3;
    	let t9;
    	let svg4;
    	let path4;
    	let t10;
    	let slider1;
    	let updating_value_1;
    	let t11;
    	let span2;
    	let t12;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (!/*$FLAG_PLAYING*/ ctx[3]) return create_if_block$5;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	function slider0_value_binding(value) {
    		/*slider0_value_binding*/ ctx[14](value);
    	}

    	function slider0_max_binding(value) {
    		/*slider0_max_binding*/ ctx[15](value);
    	}

    	let slider0_props = {
    		option: {
    			trackWidth: "100%",
    			onMouseDown: /*func*/ ctx[12],
    			onMouseUp: /*func_1*/ ctx[13]
    		}
    	};

    	if (/*$PLAYER_CURRENT_TIME*/ ctx[4] !== void 0) {
    		slider0_props.value = /*$PLAYER_CURRENT_TIME*/ ctx[4];
    	}

    	if (/*playerDurationNum*/ ctx[0] !== void 0) {
    		slider0_props.max = /*playerDurationNum*/ ctx[0];
    	}

    	slider0 = new Slider({ props: slider0_props, $$inline: true });
    	binding_callbacks.push(() => bind(slider0, 'value', slider0_value_binding));
    	binding_callbacks.push(() => bind(slider0, 'max', slider0_max_binding));

    	function slider1_value_binding(value) {
    		/*slider1_value_binding*/ ctx[18](value);
    	}

    	let slider1_props = {
    		option: {
    			step: 1,
    			onMouseDown: /*func_2*/ ctx[16],
    			onMouseUp: /*func_3*/ ctx[17]
    		}
    	};

    	if (/*$PLAYER_VOLUME*/ ctx[8] !== void 0) {
    		slider1_props.value = /*$PLAYER_VOLUME*/ ctx[8];
    	}

    	slider1 = new Slider({ props: slider1_props, $$inline: true });
    	binding_callbacks.push(() => bind(slider1, 'value', slider1_value_binding));

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div0 = element("div");
    			if_block.c();
    			t0 = space();
    			div1 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t1 = space();
    			div2 = element("div");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t2 = space();
    			div5 = element("div");
    			div3 = element("div");
    			span0 = element("span");
    			t3 = text(/*playerCurrentTimeStr*/ ctx[1]);
    			t4 = space();
    			create_component(slider0.$$.fragment);
    			t5 = space();
    			span1 = element("span");
    			t6 = text(/*$PLAYER_DURATION*/ ctx[7]);
    			t7 = space();
    			div4 = element("div");
    			svg2 = svg_element("svg");
    			path2 = svg_element("path");
    			t8 = space();
    			svg3 = svg_element("svg");
    			path3 = svg_element("path");
    			t9 = space();
    			svg4 = svg_element("svg");
    			path4 = svg_element("path");
    			t10 = space();
    			create_component(slider1.$$.fragment);
    			t11 = space();
    			span2 = element("span");
    			t12 = text(/*$PLAYER_VOLUME*/ ctx[8]);
    			attr_dev(div0, "class", "song-control-btn svelte-1shfip3");
    			attr_dev(div0, "id", "play-btn");
    			add_location(div0, file$a, 74, 2, 2206);
    			attr_dev(path0, "d", "M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM352 328c0 13.2-10.8 24-24 24h-144C170.8 352 160 341.2 160 328v-144C160 170.8 170.8 160 184 160h144C341.2 160 352 170.8 352 184V328z");
    			add_location(path0, file$a, 100, 7, 3501);
    			attr_dev(svg0, "class", "icon stop svelte-1shfip3");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 512 512");
    			add_location(svg0, file$a, 96, 4, 3396);
    			attr_dev(div1, "class", "song-control-btn svelte-1shfip3");
    			attr_dev(div1, "id", "stop-btn");
    			add_location(div1, file$a, 95, 2, 3323);
    			attr_dev(path1, "d", "M287.1 447.1c17.67 0 31.1-14.33 31.1-32V96.03c0-17.67-14.33-32-32-32c-17.67 0-31.1 14.33-31.1 31.1v319.9C255.1 433.6 270.3 447.1 287.1 447.1zM52.51 440.6l192-159.1c7.625-6.436 11.43-15.53 11.43-24.62c0-9.094-3.809-18.18-11.43-24.62l-192-159.1C31.88 54.28 0 68.66 0 96.03v319.9C0 443.3 31.88 457.7 52.51 440.6z");
    			add_location(path1, file$a, 110, 7, 3967);
    			attr_dev(svg1, "class", "icon forward svelte-1shfip3");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 320 512");
    			add_location(svg1, file$a, 106, 4, 3859);
    			attr_dev(div2, "class", "song-control-btn svelte-1shfip3");
    			attr_dev(div2, "id", "forward-btn");
    			add_location(div2, file$a, 105, 2, 3780);
    			attr_dev(span0, "class", "text current-time svelte-1shfip3");
    			add_location(span0, file$a, 117, 6, 4389);
    			attr_dev(span1, "class", "text duration svelte-1shfip3");
    			add_location(span1, file$a, 147, 6, 5434);
    			attr_dev(div3, "class", "line svelte-1shfip3");
    			add_location(div3, file$a, 116, 4, 4364);
    			attr_dev(path2, "d", "M412.6 182c-10.28-8.334-25.41-6.867-33.75 3.402c-8.406 10.24-6.906 25.35 3.375 33.74C393.5 228.4 400 241.8 400 255.1c0 14.17-6.5 27.59-17.81 36.83c-10.28 8.396-11.78 23.5-3.375 33.74c4.719 5.806 11.62 8.802 18.56 8.802c5.344 0 10.75-1.779 15.19-5.399C435.1 311.5 448 284.6 448 255.1S435.1 200.4 412.6 182zM473.1 108.2c-10.22-8.334-25.34-6.898-33.78 3.34c-8.406 10.24-6.906 25.35 3.344 33.74C476.6 172.1 496 213.3 496 255.1s-19.44 82.1-53.31 110.7c-10.25 8.396-11.75 23.5-3.344 33.74c4.75 5.775 11.62 8.771 18.56 8.771c5.375 0 10.75-1.779 15.22-5.431C518.2 366.9 544 313 544 255.1S518.2 145 473.1 108.2zM534.4 33.4c-10.22-8.334-25.34-6.867-33.78 3.34c-8.406 10.24-6.906 25.35 3.344 33.74C559.9 116.3 592 183.9 592 255.1s-32.09 139.7-88.06 185.5c-10.25 8.396-11.75 23.5-3.344 33.74C505.3 481 512.2 484 519.2 484c5.375 0 10.75-1.779 15.22-5.431C601.5 423.6 640 342.5 640 255.1S601.5 88.34 534.4 33.4zM301.2 34.98c-11.5-5.181-25.01-3.076-34.43 5.29L131.8 160.1H48c-26.51 0-48 21.48-48 47.96v95.92c0 26.48 21.49 47.96 48 47.96h83.84l134.9 119.8C272.7 477 280.3 479.8 288 479.8c4.438 0 8.959-.9314 13.16-2.835C312.7 471.8 320 460.4 320 447.9V64.12C320 51.55 312.7 40.13 301.2 34.98z");
    			add_location(path2, file$a, 156, 9, 5719);
    			attr_dev(svg2, "class", "icon common volume-icon volume-high svelte-1shfip3");
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "viewBox", "0 0 640 512");
    			toggle_class(svg2, "display-block", /*$PLAYER_VOLUME*/ ctx[8] >= 65);
    			add_location(svg2, file$a, 151, 6, 5529);
    			attr_dev(path3, "d", "M412.6 181.9c-10.28-8.344-25.41-6.875-33.75 3.406c-8.406 10.25-6.906 25.37 3.375 33.78C393.5 228.4 400 241.8 400 256c0 14.19-6.5 27.62-17.81 36.87c-10.28 8.406-11.78 23.53-3.375 33.78c4.719 5.812 11.62 8.812 18.56 8.812c5.344 0 10.75-1.781 15.19-5.406C435.1 311.6 448 284.7 448 256S435.1 200.4 412.6 181.9zM301.2 34.84c-11.5-5.187-25.01-3.116-34.43 5.259L131.8 160H48c-26.51 0-48 21.49-48 47.1v95.1c0 26.51 21.49 47.1 48 47.1h83.84l134.9 119.9C272.7 477.2 280.3 480 288 480c4.438 0 8.959-.9313 13.16-2.837C312.7 472 320 460.6 320 448V64C320 51.41 312.7 39.1 301.2 34.84z");
    			add_location(path3, file$a, 165, 9, 7156);
    			attr_dev(svg3, "class", "icon common volume-icon volume-low svelte-1shfip3");
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg3, "viewBox", "0 0 448 512");
    			toggle_class(svg3, "display-block", /*$PLAYER_VOLUME*/ ctx[8] > 0 && /*$PLAYER_VOLUME*/ ctx[8] < 65);
    			add_location(svg3, file$a, 160, 6, 6946);
    			attr_dev(path4, "d", "M320 64v383.1c0 12.59-7.337 24.01-18.84 29.16C296.1 479.1 292.4 480 288 480c-7.688 0-15.28-2.781-21.27-8.094l-134.9-119.9H48c-26.51 0-48-21.49-48-47.1V208c0-26.51 21.49-47.1 48-47.1h83.84l134.9-119.9c9.422-8.375 22.93-10.45 34.43-5.259C312.7 39.1 320 51.41 320 64z");
    			add_location(path4, file$a, 174, 9, 7966);
    			attr_dev(svg4, "class", "icon common volume-icon volume-off svelte-1shfip3");
    			attr_dev(svg4, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg4, "viewBox", "0 0 320 512");
    			toggle_class(svg4, "display-block", /*$PLAYER_VOLUME*/ ctx[8] === 0);
    			add_location(svg4, file$a, 169, 6, 7777);
    			attr_dev(span2, "class", "text svelte-1shfip3");
    			add_location(span2, file$a, 190, 6, 8565);
    			attr_dev(div4, "class", "line svelte-1shfip3");
    			add_location(div4, file$a, 150, 4, 5504);
    			attr_dev(div5, "class", "song-control-slider svelte-1shfip3");
    			add_location(div5, file$a, 115, 2, 4326);
    			attr_dev(div6, "id", "song-control-interface");
    			attr_dev(div6, "class", "svelte-1shfip3");
    			add_location(div6, file$a, 73, 0, 2170);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div0);
    			if_block.m(div0, null);
    			append_dev(div6, t0);
    			append_dev(div6, div1);
    			append_dev(div1, svg0);
    			append_dev(svg0, path0);
    			append_dev(div6, t1);
    			append_dev(div6, div2);
    			append_dev(div2, svg1);
    			append_dev(svg1, path1);
    			append_dev(div6, t2);
    			append_dev(div6, div5);
    			append_dev(div5, div3);
    			append_dev(div3, span0);
    			append_dev(span0, t3);
    			append_dev(div3, t4);
    			mount_component(slider0, div3, null);
    			append_dev(div3, t5);
    			append_dev(div3, span1);
    			append_dev(span1, t6);
    			append_dev(div5, t7);
    			append_dev(div5, div4);
    			append_dev(div4, svg2);
    			append_dev(svg2, path2);
    			append_dev(div4, t8);
    			append_dev(div4, svg3);
    			append_dev(svg3, path3);
    			append_dev(div4, t9);
    			append_dev(div4, svg4);
    			append_dev(svg4, path4);
    			append_dev(div4, t10);
    			mount_component(slider1, div4, null);
    			append_dev(div4, t11);
    			append_dev(div4, span2);
    			append_dev(span2, t12);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*clickPlayBtn*/ ctx[9], false, false, false),
    					listen_dev(div1, "click", /*clickStopBtn*/ ctx[10], false, false, false),
    					listen_dev(div2, "click", /*clickForwardBtn*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}

    			if (!current || dirty & /*playerCurrentTimeStr*/ 2) set_data_dev(t3, /*playerCurrentTimeStr*/ ctx[1]);
    			const slider0_changes = {};

    			if (dirty & /*$FLAG_PLAYING, $FLAG_PLAYER_IS_READY, $FLAG_PLAYER_IS_BUFFERING, $PLAYER_ELEMENT, $PLAYER_CURRENT_TIME*/ 124) slider0_changes.option = {
    				trackWidth: "100%",
    				onMouseDown: /*func*/ ctx[12],
    				onMouseUp: /*func_1*/ ctx[13]
    			};

    			if (!updating_value && dirty & /*$PLAYER_CURRENT_TIME*/ 16) {
    				updating_value = true;
    				slider0_changes.value = /*$PLAYER_CURRENT_TIME*/ ctx[4];
    				add_flush_callback(() => updating_value = false);
    			}

    			if (!updating_max && dirty & /*playerDurationNum*/ 1) {
    				updating_max = true;
    				slider0_changes.max = /*playerDurationNum*/ ctx[0];
    				add_flush_callback(() => updating_max = false);
    			}

    			slider0.$set(slider0_changes);
    			if (!current || dirty & /*$PLAYER_DURATION*/ 128) set_data_dev(t6, /*$PLAYER_DURATION*/ ctx[7]);

    			if (dirty & /*$PLAYER_VOLUME*/ 256) {
    				toggle_class(svg2, "display-block", /*$PLAYER_VOLUME*/ ctx[8] >= 65);
    			}

    			if (dirty & /*$PLAYER_VOLUME*/ 256) {
    				toggle_class(svg3, "display-block", /*$PLAYER_VOLUME*/ ctx[8] > 0 && /*$PLAYER_VOLUME*/ ctx[8] < 65);
    			}

    			if (dirty & /*$PLAYER_VOLUME*/ 256) {
    				toggle_class(svg4, "display-block", /*$PLAYER_VOLUME*/ ctx[8] === 0);
    			}

    			const slider1_changes = {};

    			if (!updating_value_1 && dirty & /*$PLAYER_VOLUME*/ 256) {
    				updating_value_1 = true;
    				slider1_changes.value = /*$PLAYER_VOLUME*/ ctx[8];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			slider1.$set(slider1_changes);
    			if (!current || dirty & /*$PLAYER_VOLUME*/ 256) set_data_dev(t12, /*$PLAYER_VOLUME*/ ctx[8]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(slider0.$$.fragment, local);
    			transition_in(slider1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(slider0.$$.fragment, local);
    			transition_out(slider1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			if_block.d();
    			destroy_component(slider0);
    			destroy_component(slider1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $PLAYER_ELEMENT;
    	let $FLAG_ON_CHANGE_CURRENT_TIME;
    	let $FLAG_PLAYING;
    	let $PLAYLIST;
    	let $PLAYER_CURRENT_TIME;
    	let $FLAG_PLAYER_IS_READY;
    	let $FLAG_PLAYER_IS_BUFFERING;
    	let $PLAYER_DURATION;
    	let $PLAYER_VOLUME;
    	validate_store(PLAYER_ELEMENT, 'PLAYER_ELEMENT');
    	component_subscribe($$self, PLAYER_ELEMENT, $$value => $$invalidate(2, $PLAYER_ELEMENT = $$value));
    	validate_store(FLAG_ON_CHANGE_CURRENT_TIME, 'FLAG_ON_CHANGE_CURRENT_TIME');
    	component_subscribe($$self, FLAG_ON_CHANGE_CURRENT_TIME, $$value => $$invalidate(19, $FLAG_ON_CHANGE_CURRENT_TIME = $$value));
    	validate_store(FLAG_PLAYING, 'FLAG_PLAYING');
    	component_subscribe($$self, FLAG_PLAYING, $$value => $$invalidate(3, $FLAG_PLAYING = $$value));
    	validate_store(PLAYLIST, 'PLAYLIST');
    	component_subscribe($$self, PLAYLIST, $$value => $$invalidate(20, $PLAYLIST = $$value));
    	validate_store(PLAYER_CURRENT_TIME, 'PLAYER_CURRENT_TIME');
    	component_subscribe($$self, PLAYER_CURRENT_TIME, $$value => $$invalidate(4, $PLAYER_CURRENT_TIME = $$value));
    	validate_store(FLAG_PLAYER_IS_READY, 'FLAG_PLAYER_IS_READY');
    	component_subscribe($$self, FLAG_PLAYER_IS_READY, $$value => $$invalidate(5, $FLAG_PLAYER_IS_READY = $$value));
    	validate_store(FLAG_PLAYER_IS_BUFFERING, 'FLAG_PLAYER_IS_BUFFERING');
    	component_subscribe($$self, FLAG_PLAYER_IS_BUFFERING, $$value => $$invalidate(6, $FLAG_PLAYER_IS_BUFFERING = $$value));
    	validate_store(PLAYER_DURATION, 'PLAYER_DURATION');
    	component_subscribe($$self, PLAYER_DURATION, $$value => $$invalidate(7, $PLAYER_DURATION = $$value));
    	validate_store(PLAYER_VOLUME, 'PLAYER_VOLUME');
    	component_subscribe($$self, PLAYER_VOLUME, $$value => $$invalidate(8, $PLAYER_VOLUME = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SongControl', slots, []);
    	let playerDurationNum = 0;
    	let playerCurrentTimeStr = "00:00";

    	/**
     * 재생/일시정지 버튼 클릭 이벤트 핸들러
     */
    	const clickPlayBtn = () => {
    		const currentSong = $PLAYLIST.currentSong;

    		// 재생 대기열 및 현재재생중인 노래가 있는지 검사
    		if ($PLAYLIST.queue.length == 0 && currentSong === null) {
    			errorToast("재생대기열에 노래가 없습니다.");
    			return;
    		}

    		// 재생 상태 토글
    		FLAG_PLAYING.set(!$FLAG_PLAYING);

    		// 재생상태가 재생시작인 경우이고 현재 재생중인 곡이 없는 경우
    		if ($FLAG_PLAYING && currentSong === null) {
    			playSong($FLAG_PLAYING);
    		} else // 현재 재생중인 곡이 있는 경우에서 재생 토글
    		{
    			if ((currentSong === null || currentSong === void 0
    			? void 0
    			: currentSong.type) === "youtube") {
    				if ($FLAG_PLAYING) {
    					$PLAYER_ELEMENT.playVideo();
    				} else $PLAYER_ELEMENT.pauseVideo();
    			} else if ((currentSong === null || currentSong === void 0
    			? void 0
    			: currentSong.type) === "local") ;
    		}
    	};

    	/**
     * 재생 중지 버튼 클릭 이벤트 핸들러
     */
    	const clickStopBtn = () => {
    		stopSong();
    	};

    	/**
     * 다음곡 버튼 클릭 이벤트 핸들러
     */
    	const clickForwardBtn = () => {
    		fowardSong($FLAG_PLAYING);
    	};

    	/**
     * 볼륨 값 변경 시 이벤트 핸들러
     */
    	PLAYER_VOLUME.subscribe(value => {
    		localStorage.setItem("playerVolume", String(value));

    		if ($FLAG_PLAYING && value !== undefined) {
    			$PLAYER_ELEMENT.setVolume(value);
    		}
    	});

    	/**
     * 현재 재생시간 변경 시 이벤트 핸들러
     */
    	PLAYER_CURRENT_TIME.subscribe(value => {
    		$$invalidate(1, playerCurrentTimeStr = getDurationNumToStr(value));

    		if ($FLAG_ON_CHANGE_CURRENT_TIME) {
    			$PLAYER_ELEMENT.seekTo(value, false);
    		}
    	});

    	/**
     * Duration 변경 시 이벤트 핸들러
     */
    	PLAYER_DURATION.subscribe(value => {
    		$$invalidate(0, playerDurationNum = getDurationStrToNum(value));
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SongControl> was created with unknown prop '${key}'`);
    	});

    	const func = () => {
    		if ($FLAG_PLAYING && $FLAG_PLAYER_IS_READY && !$FLAG_PLAYER_IS_BUFFERING) {
    			FLAG_ON_CHANGE_CURRENT_TIME.set(true);
    			$PLAYER_ELEMENT.seekTo($PLAYER_CURRENT_TIME, false);
    		} else if (!$FLAG_PLAYING && $FLAG_PLAYER_IS_READY) $PLAYER_ELEMENT.playVideo();
    	};

    	const func_1 = () => {
    		FLAG_ON_CHANGE_CURRENT_TIME.set(false);
    		if ($FLAG_PLAYING && $FLAG_PLAYER_IS_READY && !$FLAG_PLAYER_IS_BUFFERING) $PLAYER_ELEMENT.seekTo($PLAYER_CURRENT_TIME); else if (!$FLAG_PLAYING && $FLAG_PLAYER_IS_READY) $PLAYER_ELEMENT.playVideo();
    	};

    	function slider0_value_binding(value) {
    		$PLAYER_CURRENT_TIME = value;
    		PLAYER_CURRENT_TIME.set($PLAYER_CURRENT_TIME);
    	}

    	function slider0_max_binding(value) {
    		playerDurationNum = value;
    		$$invalidate(0, playerDurationNum);
    	}

    	const func_2 = () => {
    		FLAG_ON_CHANGE_VOLUME.set(true);
    	};

    	const func_3 = () => {
    		FLAG_ON_CHANGE_VOLUME.set(false);
    	};

    	function slider1_value_binding(value) {
    		$PLAYER_VOLUME = value;
    		PLAYER_VOLUME.set($PLAYER_VOLUME);
    	}

    	$$self.$capture_state = () => ({
    		errorToast,
    		FLAG_PLAYING,
    		PLAYLIST,
    		PLAYER_ELEMENT,
    		PLAYER_VOLUME,
    		FLAG_ON_CHANGE_VOLUME,
    		FLAG_ON_CHANGE_CURRENT_TIME,
    		PLAYER_DURATION,
    		PLAYER_CURRENT_TIME,
    		FLAG_PLAYER_IS_READY,
    		FLAG_PLAYER_IS_BUFFERING,
    		playSong,
    		stopSong,
    		fowardSong,
    		getDurationNumToStr,
    		getDurationStrToNum,
    		Slider,
    		playerDurationNum,
    		playerCurrentTimeStr,
    		clickPlayBtn,
    		clickStopBtn,
    		clickForwardBtn,
    		$PLAYER_ELEMENT,
    		$FLAG_ON_CHANGE_CURRENT_TIME,
    		$FLAG_PLAYING,
    		$PLAYLIST,
    		$PLAYER_CURRENT_TIME,
    		$FLAG_PLAYER_IS_READY,
    		$FLAG_PLAYER_IS_BUFFERING,
    		$PLAYER_DURATION,
    		$PLAYER_VOLUME
    	});

    	$$self.$inject_state = $$props => {
    		if ('playerDurationNum' in $$props) $$invalidate(0, playerDurationNum = $$props.playerDurationNum);
    		if ('playerCurrentTimeStr' in $$props) $$invalidate(1, playerCurrentTimeStr = $$props.playerCurrentTimeStr);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		playerDurationNum,
    		playerCurrentTimeStr,
    		$PLAYER_ELEMENT,
    		$FLAG_PLAYING,
    		$PLAYER_CURRENT_TIME,
    		$FLAG_PLAYER_IS_READY,
    		$FLAG_PLAYER_IS_BUFFERING,
    		$PLAYER_DURATION,
    		$PLAYER_VOLUME,
    		clickPlayBtn,
    		clickStopBtn,
    		clickForwardBtn,
    		func,
    		func_1,
    		slider0_value_binding,
    		slider0_max_binding,
    		func_2,
    		func_3,
    		slider1_value_binding
    	];
    }

    class SongControl extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SongControl",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src/components/common/EmptyCover.svelte generated by Svelte v3.48.0 */

    const file$9 = "src/components/common/EmptyCover.svelte";

    function create_fragment$b(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "empty-cover svelte-tt3r1y");
    			set_style(div, "height", /*height*/ ctx[2]);
    			set_style(div, "color", /*color*/ ctx[1]);
    			add_location(div, file$9, 5, 0, 129);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			div.innerHTML = /*msg*/ ctx[0];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*msg*/ 1) div.innerHTML = /*msg*/ ctx[0];
    			if (dirty & /*height*/ 4) {
    				set_style(div, "height", /*height*/ ctx[2]);
    			}

    			if (dirty & /*color*/ 2) {
    				set_style(div, "color", /*color*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EmptyCover', slots, []);
    	let { msg } = $$props;
    	let { color = "#666" } = $$props;
    	let { height = "calc(100% - 1.5em - 0.8em - 20px)" } = $$props;
    	const writable_props = ['msg', 'color', 'height'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EmptyCover> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('msg' in $$props) $$invalidate(0, msg = $$props.msg);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    	};

    	$$self.$capture_state = () => ({ msg, color, height });

    	$$self.$inject_state = $$props => {
    		if ('msg' in $$props) $$invalidate(0, msg = $$props.msg);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [msg, color, height];
    }

    class EmptyCover extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { msg: 0, color: 1, height: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EmptyCover",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*msg*/ ctx[0] === undefined && !('msg' in props)) {
    			console.warn("<EmptyCover> was created without expected prop 'msg'");
    		}
    	}

    	get msg() {
    		throw new Error("<EmptyCover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set msg(value) {
    		throw new Error("<EmptyCover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<EmptyCover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<EmptyCover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<EmptyCover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<EmptyCover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/PlayerApp/WritableText.svelte generated by Svelte v3.48.0 */
    const file$8 = "src/components/PlayerApp/WritableText.svelte";

    function create_fragment$a(ctx) {
    	let div;
    	let span0;
    	let t0_value = /*option*/ ctx[0].text + "";
    	let t0;
    	let svg;
    	let path;
    	let t1;
    	let span1;
    	let input;
    	let t2;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span0 = element("span");
    			t0 = text(t0_value);
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t1 = space();
    			span1 = element("span");
    			input = element("input");
    			t2 = space();
    			button = element("button");
    			button.textContent = "수정";
    			attr_dev(path, "d", "M421.7 220.3L188.5 453.4L154.6 419.5L158.1 416H112C103.2 416 96 408.8 96 400V353.9L92.51 357.4C87.78 362.2 84.31 368 82.42 374.4L59.44 452.6L137.6 429.6C143.1 427.7 149.8 424.2 154.6 419.5L188.5 453.4C178.1 463.8 165.2 471.5 151.1 475.6L30.77 511C22.35 513.5 13.24 511.2 7.03 504.1C.8198 498.8-1.502 489.7 .976 481.2L36.37 360.9C40.53 346.8 48.16 333.9 58.57 323.5L291.7 90.34L421.7 220.3zM492.7 58.75C517.7 83.74 517.7 124.3 492.7 149.3L444.3 197.7L314.3 67.72L362.7 19.32C387.7-5.678 428.3-5.678 453.3 19.32L492.7 58.75z");
    			add_location(path, file$8, 43, 7, 1126);
    			attr_dev(svg, "class", "write-icon svelte-1bv6jg2");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file$8, 39, 18, 1020);
    			attr_dev(span0, "class", "text svelte-1bv6jg2");
    			toggle_class(span0, "current-song", /*option*/ ctx[0].isCurrentSong);
    			toggle_class(span0, "display-none", /*writeMode*/ ctx[1]);
    			add_location(span0, file$8, 32, 2, 839);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "svelte-1bv6jg2");
    			add_location(input, file$8, 49, 4, 1761);
    			attr_dev(button, "class", "svelte-1bv6jg2");
    			add_location(button, file$8, 50, 4, 1815);
    			attr_dev(span1, "class", "write-area svelte-1bv6jg2");
    			toggle_class(span1, "display-none", !/*writeMode*/ ctx[1]);
    			add_location(span1, file$8, 48, 2, 1699);
    			attr_dev(div, "class", "writable-text svelte-1bv6jg2");
    			toggle_class(div, "current-song", /*option*/ ctx[0].isCurrentSong);
    			add_location(div, file$8, 31, 0, 767);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span0);
    			append_dev(span0, t0);
    			append_dev(span0, svg);
    			append_dev(svg, path);
    			append_dev(div, t1);
    			append_dev(div, span1);
    			append_dev(span1, input);
    			set_input_value(input, /*inputTextValue*/ ctx[2]);
    			append_dev(span1, t2);
    			append_dev(span1, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span0, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[5]),
    					listen_dev(button, "click", /*saveText*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*option*/ 1 && t0_value !== (t0_value = /*option*/ ctx[0].text + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*option*/ 1) {
    				toggle_class(span0, "current-song", /*option*/ ctx[0].isCurrentSong);
    			}

    			if (dirty & /*writeMode*/ 2) {
    				toggle_class(span0, "display-none", /*writeMode*/ ctx[1]);
    			}

    			if (dirty & /*inputTextValue*/ 4 && input.value !== /*inputTextValue*/ ctx[2]) {
    				set_input_value(input, /*inputTextValue*/ ctx[2]);
    			}

    			if (dirty & /*writeMode*/ 2) {
    				toggle_class(span1, "display-none", !/*writeMode*/ ctx[1]);
    			}

    			if (dirty & /*option*/ 1) {
    				toggle_class(div, "current-song", /*option*/ ctx[0].isCurrentSong);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('WritableText', slots, []);
    	let { option } = $$props;
    	let writeMode = false;
    	let inputTextValue = option.text;

    	/**
     * PlayList 내 queue의 특정 텍스트를 수정하는 함수
     */
    	const saveTextAtQueue = () => {
    		get_store_value(PLAYLIST).queue[option.index][option.key] = inputTextValue;
    		savePlayList();
    		$$invalidate(1, writeMode = false);
    	};

    	/**
     * PlayList 내 currentSong의 특정 텍스트를 수정하는 함수
     */
    	const saveTextAtCurrentSong = () => {
    		get_store_value(PLAYLIST).currentSong[option.key] = inputTextValue;
    		savePlayList();
    		$$invalidate(1, writeMode = false);
    	};

    	/**
     * option의 isCurrentSong에 따라 함수를 지정함.
     */
    	const saveText = option.isCurrentSong
    	? saveTextAtCurrentSong
    	: saveTextAtQueue;

    	const writable_props = ['option'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<WritableText> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(1, writeMode = !writeMode);
    	};

    	function input_input_handler() {
    		inputTextValue = this.value;
    		$$invalidate(2, inputTextValue);
    	}

    	$$self.$$set = $$props => {
    		if ('option' in $$props) $$invalidate(0, option = $$props.option);
    	};

    	$$self.$capture_state = () => ({
    		get: get_store_value,
    		PLAYLIST,
    		savePlayList,
    		option,
    		writeMode,
    		inputTextValue,
    		saveTextAtQueue,
    		saveTextAtCurrentSong,
    		saveText
    	});

    	$$self.$inject_state = $$props => {
    		if ('option' in $$props) $$invalidate(0, option = $$props.option);
    		if ('writeMode' in $$props) $$invalidate(1, writeMode = $$props.writeMode);
    		if ('inputTextValue' in $$props) $$invalidate(2, inputTextValue = $$props.inputTextValue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		option,
    		writeMode,
    		inputTextValue,
    		saveText,
    		click_handler,
    		input_input_handler
    	];
    }

    class WritableText extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { option: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WritableText",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*option*/ ctx[0] === undefined && !('option' in props)) {
    			console.warn("<WritableText> was created without expected prop 'option'");
    		}
    	}

    	get option() {
    		throw new Error("<WritableText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set option(value) {
    		throw new Error("<WritableText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/PlayerApp/PlayListTable.svelte generated by Svelte v3.48.0 */
    const file$7 = "src/components/PlayerApp/PlayListTable.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[8] = i;
    	return child_ctx;
    }

    // (123:0) {:else}
    function create_else_block$3(ctx) {
    	let emptycover;
    	let current;

    	emptycover = new EmptyCover({
    			props: {
    				msg: "플레이리스트에 대기 중인 곡이 없습니다.<br>YouTube 또는 로컬 음원파일(MP3, WAV, FLAC)을 추가해보세요!",
    				height: "100%"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(emptycover.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(emptycover, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(emptycover.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(emptycover.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(emptycover, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(123:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (36:0) {#if $PLAYLIST.queue.length != 0}
    function create_if_block$4(ctx) {
    	let table;
    	let colgroup;
    	let col0;
    	let t0;
    	let col1;
    	let t1;
    	let col2;
    	let t2;
    	let col3;
    	let t3;
    	let col4;
    	let t4;
    	let col5;
    	let t5;
    	let tbody;
    	let current;
    	let each_value = /*$PLAYLIST*/ ctx[0].queue;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			table = element("table");
    			colgroup = element("colgroup");
    			col0 = element("col");
    			t0 = space();
    			col1 = element("col");
    			t1 = space();
    			col2 = element("col");
    			t2 = space();
    			col3 = element("col");
    			t3 = space();
    			col4 = element("col");
    			t4 = space();
    			col5 = element("col");
    			t5 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(col0, "width", "40px");
    			add_location(col0, file$7, 38, 6, 1148);
    			attr_dev(col1, "width", "300px");
    			add_location(col1, file$7, 39, 6, 1175);
    			attr_dev(col2, "width", "150px");
    			add_location(col2, file$7, 40, 6, 1203);
    			attr_dev(col3, "width", "70px");
    			add_location(col3, file$7, 41, 6, 1231);
    			attr_dev(col4, "width", "70px");
    			add_location(col4, file$7, 42, 6, 1258);
    			attr_dev(col5, "width", "100px");
    			add_location(col5, file$7, 43, 6, 1285);
    			add_location(colgroup, file$7, 37, 4, 1131);
    			add_location(tbody, file$7, 45, 4, 1327);
    			attr_dev(table, "class", "playlist-table svelte-16mtqrf");
    			add_location(table, file$7, 36, 2, 1096);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, colgroup);
    			append_dev(colgroup, col0);
    			append_dev(colgroup, t0);
    			append_dev(colgroup, col1);
    			append_dev(colgroup, t1);
    			append_dev(colgroup, col2);
    			append_dev(colgroup, t2);
    			append_dev(colgroup, col3);
    			append_dev(colgroup, t3);
    			append_dev(colgroup, col4);
    			append_dev(colgroup, t4);
    			append_dev(colgroup, col5);
    			append_dev(table, t5);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*songDel, songUpDown, $PLAYLIST*/ 7) {
    				each_value = /*$PLAYLIST*/ ctx[0].queue;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(36:0) {#if $PLAYLIST.queue.length != 0}",
    		ctx
    	});

    	return block;
    }

    // (47:6) {#each $PLAYLIST.queue as song, i}
    function create_each_block$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*i*/ ctx[8] + 1 + "";
    	let t0;
    	let t1;
    	let td1;
    	let writabletext0;
    	let t2;
    	let td2;
    	let writabletext1;
    	let t3;
    	let td3;
    	let t4_value = /*song*/ ctx[6].type + "";
    	let t4;
    	let t5;
    	let td4;
    	let t6_value = /*song*/ ctx[6].duration + "";
    	let t6;
    	let t7;
    	let td5;
    	let div0;
    	let svg0;
    	let path0;
    	let t8;
    	let div1;
    	let svg1;
    	let path1;
    	let t9;
    	let div2;
    	let svg2;
    	let path2;
    	let t10;
    	let current;
    	let mounted;
    	let dispose;

    	writabletext0 = new WritableText({
    			props: {
    				option: {
    					text: /*song*/ ctx[6].title,
    					key: "title",
    					index: /*i*/ ctx[8],
    					isCurrentSong: false
    				}
    			},
    			$$inline: true
    		});

    	writabletext1 = new WritableText({
    			props: {
    				option: {
    					text: /*song*/ ctx[6].artist,
    					key: "artist",
    					index: /*i*/ ctx[8],
    					isCurrentSong: false
    				}
    			},
    			$$inline: true
    		});

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*i*/ ctx[8]);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[4](/*i*/ ctx[8]);
    	}

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[5](/*i*/ ctx[8]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			create_component(writabletext0.$$.fragment);
    			t2 = space();
    			td2 = element("td");
    			create_component(writabletext1.$$.fragment);
    			t3 = space();
    			td3 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td4 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td5 = element("td");
    			div0 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t8 = space();
    			div1 = element("div");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t9 = space();
    			div2 = element("div");
    			svg2 = svg_element("svg");
    			path2 = svg_element("path");
    			t10 = space();
    			attr_dev(td0, "class", "svelte-16mtqrf");
    			add_location(td0, file$7, 48, 10, 1399);
    			attr_dev(td1, "class", "svelte-16mtqrf");
    			add_location(td1, file$7, 49, 10, 1426);
    			attr_dev(td2, "class", "svelte-16mtqrf");
    			add_location(td2, file$7, 59, 10, 1667);
    			attr_dev(td3, "class", "svelte-16mtqrf");
    			add_location(td3, file$7, 69, 10, 1910);
    			attr_dev(td4, "class", "svelte-16mtqrf");
    			add_location(td4, file$7, 70, 10, 1941);
    			attr_dev(path0, "d", "M9.39 265.4l127.1-128C143.6 131.1 151.8 128 160 128s16.38 3.125 22.63 9.375l127.1 128c9.156 9.156 11.9 22.91 6.943 34.88S300.9 320 287.1 320H32.01c-12.94 0-24.62-7.781-29.58-19.75S.2333 274.5 9.39 265.4z");
    			add_location(path0, file$7, 82, 17, 2293);
    			attr_dev(svg0, "class", "icon svelte-16mtqrf");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 320 512");
    			add_location(svg0, file$7, 78, 14, 2153);
    			attr_dev(div0, "class", "song-setting-btn song-up svelte-16mtqrf");
    			add_location(div0, file$7, 72, 12, 1993);
    			attr_dev(path1, "d", "M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z");
    			add_location(path1, file$7, 97, 17, 2902);
    			attr_dev(svg1, "class", "icon svelte-16mtqrf");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 320 512");
    			add_location(svg1, file$7, 93, 14, 2762);
    			attr_dev(div1, "class", "song-setting-btn song-down svelte-16mtqrf");
    			add_location(div1, file$7, 87, 12, 2596);
    			attr_dev(path2, "d", "M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z");
    			add_location(path2, file$7, 112, 17, 3505);
    			attr_dev(svg2, "class", "icon svelte-16mtqrf");
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "viewBox", "0 0 320 512");
    			add_location(svg2, file$7, 108, 14, 3365);
    			attr_dev(div2, "class", "song-setting-btn song-del svelte-16mtqrf");
    			add_location(div2, file$7, 102, 12, 3207);
    			attr_dev(td5, "class", "svelte-16mtqrf");
    			add_location(td5, file$7, 71, 10, 1976);
    			attr_dev(tr, "class", "svelte-16mtqrf");
    			add_location(tr, file$7, 47, 8, 1384);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			mount_component(writabletext0, td1, null);
    			append_dev(tr, t2);
    			append_dev(tr, td2);
    			mount_component(writabletext1, td2, null);
    			append_dev(tr, t3);
    			append_dev(tr, td3);
    			append_dev(td3, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td4);
    			append_dev(td4, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td5);
    			append_dev(td5, div0);
    			append_dev(div0, svg0);
    			append_dev(svg0, path0);
    			append_dev(td5, t8);
    			append_dev(td5, div1);
    			append_dev(div1, svg1);
    			append_dev(svg1, path1);
    			append_dev(td5, t9);
    			append_dev(td5, div2);
    			append_dev(div2, svg2);
    			append_dev(svg2, path2);
    			append_dev(tr, t10);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", click_handler, false, false, false),
    					listen_dev(div1, "click", click_handler_1, false, false, false),
    					listen_dev(div2, "click", click_handler_2, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const writabletext0_changes = {};

    			if (dirty & /*$PLAYLIST*/ 1) writabletext0_changes.option = {
    				text: /*song*/ ctx[6].title,
    				key: "title",
    				index: /*i*/ ctx[8],
    				isCurrentSong: false
    			};

    			writabletext0.$set(writabletext0_changes);
    			const writabletext1_changes = {};

    			if (dirty & /*$PLAYLIST*/ 1) writabletext1_changes.option = {
    				text: /*song*/ ctx[6].artist,
    				key: "artist",
    				index: /*i*/ ctx[8],
    				isCurrentSong: false
    			};

    			writabletext1.$set(writabletext1_changes);
    			if ((!current || dirty & /*$PLAYLIST*/ 1) && t4_value !== (t4_value = /*song*/ ctx[6].type + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*$PLAYLIST*/ 1) && t6_value !== (t6_value = /*song*/ ctx[6].duration + "")) set_data_dev(t6, t6_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(writabletext0.$$.fragment, local);
    			transition_in(writabletext1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(writabletext0.$$.fragment, local);
    			transition_out(writabletext1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(writabletext0);
    			destroy_component(writabletext1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(47:6) {#each $PLAYLIST.queue as song, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$4, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$PLAYLIST*/ ctx[0].queue.length != 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $PLAYLIST;
    	validate_store(PLAYLIST, 'PLAYLIST');
    	component_subscribe($$self, PLAYLIST, $$value => $$invalidate(0, $PLAYLIST = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PlayListTable', slots, []);

    	const songUpDown = (n, offset = 1) => {
    		if (n > 0 && offset === 1 || $PLAYLIST.queue.length - 1 !== n && offset === -1) {
    			const songA = $PLAYLIST.queue[n];
    			const songB = $PLAYLIST.queue[n - 1 * offset];
    			set_store_value(PLAYLIST, $PLAYLIST.queue[n] = songB, $PLAYLIST);
    			set_store_value(PLAYLIST, $PLAYLIST.queue[n - 1 * offset] = songA, $PLAYLIST);
    			savePlayList();
    		}
    	};

    	/**
     * 재생 대기열 내 노래를 제거하는 함수
     * @param n 제거할 노래의 인덱스 번호
     */
    	const songDel = n => {
    		if (n >= 0 && n <= $PLAYLIST.queue.length - 1) {
    			if (confirm("정말 재생대기열에서 삭제하시겠습니까?")) {
    				$PLAYLIST.queue.splice(n, 1);
    				savePlayList();
    				successToast("노래를 재생대기열에서 삭제했습니다.");
    			}
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PlayListTable> was created with unknown prop '${key}'`);
    	});

    	const click_handler = i => {
    		songUpDown(i);
    	};

    	const click_handler_1 = i => {
    		songUpDown(i, -1);
    	};

    	const click_handler_2 = i => {
    		songDel(i);
    	};

    	$$self.$capture_state = () => ({
    		EmptyCover,
    		WritableText,
    		successToast,
    		PLAYLIST,
    		savePlayList,
    		songUpDown,
    		songDel,
    		$PLAYLIST
    	});

    	return [
    		$PLAYLIST,
    		songUpDown,
    		songDel,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class PlayListTable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlayListTable",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/components/PlayerApp/HistoryList.svelte generated by Svelte v3.48.0 */
    const file$6 = "src/components/PlayerApp/HistoryList.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    // (20:0) {#if $FLAG_HISTORY_LIST}
    function create_if_block$3(ctx) {
    	let div0;
    	let t0;
    	let div5;
    	let div3;
    	let div1;
    	let t1;
    	let span;
    	let t3;
    	let div2;
    	let t4;
    	let div4;
    	let current_block_type_index;
    	let if_block;
    	let div5_transition;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$PLAYLIST*/ ctx[0].history.length != 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			div5 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			t1 = text("History");
    			span = element("span");
    			span.textContent = "최근 재생 기록(최대 50개까지)";
    			t3 = space();
    			div2 = element("div");
    			t4 = space();
    			div4 = element("div");
    			if_block.c();
    			attr_dev(div0, "id", "history-list-screensaver");
    			attr_dev(div0, "class", "svelte-binxks");
    			add_location(div0, file$6, 20, 2, 678);
    			attr_dev(span, "class", "subtitle svelte-binxks");
    			add_location(span, file$6, 29, 15, 931);
    			attr_dev(div1, "class", "title svelte-binxks");
    			add_location(div1, file$6, 28, 6, 896);
    			attr_dev(div2, "class", "exit-btn svelte-binxks");
    			add_location(div2, file$6, 31, 6, 999);
    			attr_dev(div3, "class", "title-area svelte-binxks");
    			add_location(div3, file$6, 27, 4, 865);
    			attr_dev(div4, "class", "list svelte-binxks");
    			add_location(div4, file$6, 39, 4, 1131);
    			attr_dev(div5, "id", "history-list-area");
    			attr_dev(div5, "class", "svelte-binxks");
    			add_location(div5, file$6, 26, 2, 789);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div3);
    			append_dev(div3, div1);
    			append_dev(div1, t1);
    			append_dev(div1, span);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div5, t4);
    			append_dev(div5, div4);
    			if_blocks[current_block_type_index].m(div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(div2, "click", /*click_handler_1*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div4, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			add_render_callback(() => {
    				if (!div5_transition) div5_transition = create_bidirectional_transition(div5, fly, { x: 300, duration: 500 }, true);
    				div5_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (!div5_transition) div5_transition = create_bidirectional_transition(div5, fly, { x: 300, duration: 500 }, false);
    			div5_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div5);
    			if_blocks[current_block_type_index].d();
    			if (detaching && div5_transition) div5_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(20:0) {#if $FLAG_HISTORY_LIST}",
    		ctx
    	});

    	return block;
    }

    // (94:6) {:else}
    function create_else_block$2(ctx) {
    	let emptycover;
    	let current;

    	emptycover = new EmptyCover({
    			props: {
    				height: "100%",
    				msg: "재생 기록이 없습니다.",
    				color: "#fff"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(emptycover.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(emptycover, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(emptycover.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(emptycover.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(emptycover, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(94:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:6) {#if $PLAYLIST.history.length != 0}
    function create_if_block_1$2(ctx) {
    	let each_1_anchor;
    	let each_value = /*$PLAYLIST*/ ctx[0].history;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*addSongToPlaylist, delHistorySong, $PLAYLIST*/ 13) {
    				each_value = /*$PLAYLIST*/ ctx[0].history;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(41:6) {#if $PLAYLIST.history.length != 0}",
    		ctx
    	});

    	return block;
    }

    // (67:46) 
    function create_if_block_3$1(ctx) {
    	let svg;
    	let path;
    	let t0;
    	let t1_value = /*song*/ ctx[8].title + "";
    	let t1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			t1 = text(t1_value);
    			attr_dev(path, "d", "M224 128L224 0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 0 48-21.49 48-48V160h-127.1C238.3 160 224 145.7 224 128zM176 404c0 10.75-12.88 15.98-20.5 8.484L120 376H76C69.38 376 64 370.6 64 364v-56C64 301.4 69.38 296 76 296H120l35.5-36.5C163.1 251.9 176 257.3 176 268V404zM224 387.8c-4.391 0-8.75-1.835-11.91-5.367c-5.906-6.594-5.359-16.69 1.219-22.59C220.2 353.7 224 345.2 224 336s-3.797-17.69-10.69-23.88c-6.578-5.906-7.125-16-1.219-22.59c5.922-6.594 16.05-7.094 22.59-1.219C248.2 300.5 256 317.8 256 336s-7.766 35.53-21.31 47.69C231.6 386.4 227.8 387.8 224 387.8zM320 336c0 41.81-20.5 81.11-54.84 105.1c-2.781 1.938-5.988 2.875-9.145 2.875c-5.047 0-10.03-2.375-13.14-6.844c-5.047-7.25-3.281-17.22 3.969-22.28C272.6 396.9 288 367.4 288 336s-15.38-60.84-41.14-78.8c-7.25-5.062-9.027-15.03-3.98-22.28c5.047-7.281 14.99-9.062 22.27-3.969C299.5 254.9 320 294.2 320 336zM256 0v128h128L256 0z");
    			attr_dev(path, "class", "svelte-binxks");
    			add_location(path, file$6, 71, 19, 3716);
    			attr_dev(svg, "class", "icon common svelte-binxks");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 384 512");
    			add_location(svg, file$6, 67, 16, 3561);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$PLAYLIST*/ 1 && t1_value !== (t1_value = /*song*/ ctx[8].title + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(67:46) ",
    		ctx
    	});

    	return block;
    }

    // (45:14) {#if song.type === "youtube"}
    function create_if_block_2$1(ctx) {
    	let svg0;
    	let path0;
    	let t0;
    	let svg1;
    	let path1;
    	let t1;
    	let a;
    	let t2_value = /*song*/ ctx[8].title + "";
    	let t2;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t0 = space();
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t1 = space();
    			a = element("a");
    			t2 = text(t2_value);
    			attr_dev(path0, "d", "M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z");
    			attr_dev(path0, "class", "svelte-binxks");
    			add_location(path0, file$6, 49, 19, 1513);
    			attr_dev(svg0, "class", "icon youtube svelte-binxks");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 576 512");
    			add_location(svg0, file$6, 45, 16, 1357);
    			attr_dev(path1, "d", "M172.5 131.1C228.1 75.51 320.5 75.51 376.1 131.1C426.1 181.1 433.5 260.8 392.4 318.3L391.3 319.9C381 334.2 361 337.6 346.7 327.3C332.3 317 328.9 297 339.2 282.7L340.3 281.1C363.2 249 359.6 205.1 331.7 177.2C300.3 145.8 249.2 145.8 217.7 177.2L105.5 289.5C73.99 320.1 73.99 372 105.5 403.5C133.3 431.4 177.3 435 209.3 412.1L210.9 410.1C225.3 400.7 245.3 404 255.5 418.4C265.8 432.8 262.5 452.8 248.1 463.1L246.5 464.2C188.1 505.3 110.2 498.7 60.21 448.8C3.741 392.3 3.741 300.7 60.21 244.3L172.5 131.1zM467.5 380C411 436.5 319.5 436.5 263 380C213 330 206.5 251.2 247.6 193.7L248.7 192.1C258.1 177.8 278.1 174.4 293.3 184.7C307.7 194.1 311.1 214.1 300.8 229.3L299.7 230.9C276.8 262.1 280.4 306.9 308.3 334.8C339.7 366.2 390.8 366.2 422.3 334.8L534.5 222.5C566 191 566 139.1 534.5 108.5C506.7 80.63 462.7 76.99 430.7 99.9L429.1 101C414.7 111.3 394.7 107.1 384.5 93.58C374.2 79.2 377.5 59.21 391.9 48.94L393.5 47.82C451 6.731 529.8 13.25 579.8 63.24C636.3 119.7 636.3 211.3 579.8 267.7L467.5 380z");
    			attr_dev(path1, "class", "svelte-binxks");
    			add_location(path1, file$6, 57, 19, 2229);
    			attr_dev(svg1, "class", "icon common svelte-binxks");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 640 512");
    			add_location(svg1, file$6, 53, 16, 2074);
    			attr_dev(a, "href", a_href_value = "https://www.youtube.com/watch?v=" + /*song*/ ctx[8].songId);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			attr_dev(a, "class", "svelte-binxks");
    			add_location(a, file$6, 61, 16, 3312);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg0, anchor);
    			append_dev(svg0, path0);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, svg1, anchor);
    			append_dev(svg1, path1);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, a, anchor);
    			append_dev(a, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$PLAYLIST*/ 1 && t2_value !== (t2_value = /*song*/ ctx[8].title + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*$PLAYLIST*/ 1 && a_href_value !== (a_href_value = "https://www.youtube.com/watch?v=" + /*song*/ ctx[8].songId)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(svg1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(45:14) {#if song.type === \\\"youtube\\\"}",
    		ctx
    	});

    	return block;
    }

    // (42:8) {#each $PLAYLIST.history as song, i}
    function create_each_block(ctx) {
    	let div4;
    	let div0;
    	let t0;
    	let div1;
    	let t1_value = /*song*/ ctx[8].artist + "";
    	let t1;
    	let t2;
    	let div2;
    	let t3;
    	let div3;
    	let t4;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*song*/ ctx[8].type === "youtube") return create_if_block_2$1;
    		if (/*song*/ ctx[8].type === "local") return create_if_block_3$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[6](/*i*/ ctx[10]);
    	}

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[7](/*i*/ ctx[10]);
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			div2 = element("div");
    			t3 = space();
    			div3 = element("div");
    			t4 = space();
    			attr_dev(div0, "class", "line svelte-binxks");
    			add_location(div0, file$6, 43, 12, 1278);
    			attr_dev(div1, "class", "line svelte-binxks");
    			add_location(div1, file$6, 78, 12, 4776);
    			attr_dev(div2, "class", "del-btn svelte-binxks");
    			add_location(div2, file$6, 79, 12, 4826);
    			attr_dev(div3, "class", "add-btn svelte-binxks");
    			add_location(div3, file$6, 85, 12, 4972);
    			attr_dev(div4, "class", "song svelte-binxks");
    			add_location(div4, file$6, 42, 10, 1247);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			if (if_block) if_block.m(div0, null);
    			append_dev(div4, t0);
    			append_dev(div4, div1);
    			append_dev(div1, t1);
    			append_dev(div4, t2);
    			append_dev(div4, div2);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div4, t4);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div2, "click", click_handler_2, false, false, false),
    					listen_dev(div3, "click", click_handler_3, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}

    			if (dirty & /*$PLAYLIST*/ 1 && t1_value !== (t1_value = /*song*/ ctx[8].artist + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);

    			if (if_block) {
    				if_block.d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(42:8) {#each $PLAYLIST.history as song, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$FLAG_HISTORY_LIST*/ ctx[1] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$FLAG_HISTORY_LIST*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$FLAG_HISTORY_LIST*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $PLAYLIST;
    	let $FLAG_HISTORY_LIST;
    	validate_store(PLAYLIST, 'PLAYLIST');
    	component_subscribe($$self, PLAYLIST, $$value => $$invalidate(0, $PLAYLIST = $$value));
    	validate_store(FLAG_HISTORY_LIST, 'FLAG_HISTORY_LIST');
    	component_subscribe($$self, FLAG_HISTORY_LIST, $$value => $$invalidate(1, $FLAG_HISTORY_LIST = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HistoryList', slots, []);

    	const delHistorySong = index => {
    		if (confirm("플레이리스트에서 해당 재생 기록을 제거하시겠습니까?")) {
    			$PLAYLIST.history.splice(index, 1);
    			savePlayList();
    			infoToast("재생기록을 제거했습니다.");
    		}
    	};

    	const addSongToPlaylist = index => {
    		$PLAYLIST.queue.push($PLAYLIST.history[index]);
    		savePlayList();
    		successToast("플레이리스트에 추가되었습니다.");
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HistoryList> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		FLAG_HISTORY_LIST.set(false);
    	};

    	const click_handler_1 = () => {
    		FLAG_HISTORY_LIST.set(false);
    	};

    	const click_handler_2 = i => {
    		delHistorySong(i);
    	};

    	const click_handler_3 = i => {
    		addSongToPlaylist(i);
    	};

    	$$self.$capture_state = () => ({
    		fly,
    		FLAG_HISTORY_LIST,
    		PLAYLIST,
    		savePlayList,
    		infoToast,
    		successToast,
    		EmptyCover,
    		delHistorySong,
    		addSongToPlaylist,
    		$PLAYLIST,
    		$FLAG_HISTORY_LIST
    	});

    	return [
    		$PLAYLIST,
    		$FLAG_HISTORY_LIST,
    		delHistorySong,
    		addSongToPlaylist,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class HistoryList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HistoryList",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/components/PlayerApp/NowPlaying.svelte generated by Svelte v3.48.0 */
    const file$5 = "src/components/PlayerApp/NowPlaying.svelte";

    // (60:0) {:else}
    function create_else_block$1(ctx) {
    	let emptycover;
    	let current;

    	emptycover = new EmptyCover({
    			props: { msg: "현재 재생 중인 곡이 없습니다." },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(emptycover.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(emptycover, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(emptycover.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(emptycover.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(emptycover, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(60:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (6:0) {#if $PLAYLIST.currentSong !== null}
    function create_if_block$2(ctx) {
    	let div;
    	let span1;
    	let span0;
    	let t1;
    	let writabletext0;
    	let t2;
    	let span3;
    	let span2;
    	let t4;
    	let writabletext1;
    	let t5;
    	let span6;
    	let span4;
    	let t7;
    	let span5;
    	let t8_value = /*$PLAYLIST*/ ctx[0].currentSong.duration + "";
    	let t8;
    	let t9;
    	let span9;
    	let span7;
    	let t11;
    	let span8;
    	let t12_value = /*$PLAYLIST*/ ctx[0].currentSong.type + "";
    	let t12;
    	let t13;
    	let current;

    	writabletext0 = new WritableText({
    			props: {
    				option: {
    					text: /*$PLAYLIST*/ ctx[0].currentSong.title,
    					key: "title",
    					isCurrentSong: true
    				}
    			},
    			$$inline: true
    		});

    	writabletext1 = new WritableText({
    			props: {
    				option: {
    					text: /*$PLAYLIST*/ ctx[0].currentSong.artist,
    					key: "artist",
    					isCurrentSong: true
    				}
    			},
    			$$inline: true
    		});

    	let if_block = /*$PLAYLIST*/ ctx[0].currentSong.type === "youtube" && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			span1 = element("span");
    			span0 = element("span");
    			span0.textContent = "- TITLE:";
    			t1 = space();
    			create_component(writabletext0.$$.fragment);
    			t2 = space();
    			span3 = element("span");
    			span2 = element("span");
    			span2.textContent = "- ARTIST:";
    			t4 = space();
    			create_component(writabletext1.$$.fragment);
    			t5 = space();
    			span6 = element("span");
    			span4 = element("span");
    			span4.textContent = "- DURATION:";
    			t7 = space();
    			span5 = element("span");
    			t8 = text(t8_value);
    			t9 = space();
    			span9 = element("span");
    			span7 = element("span");
    			span7.textContent = "- PLATFORM:";
    			t11 = space();
    			span8 = element("span");
    			t12 = text(t12_value);
    			t13 = space();
    			if (if_block) if_block.c();
    			attr_dev(span0, "class", "subtitle svelte-e3lyc");
    			add_location(span0, file$5, 8, 7, 274);
    			attr_dev(span1, "class", "line svelte-e3lyc");
    			add_location(span1, file$5, 7, 4, 248);
    			attr_dev(span2, "class", "subtitle svelte-e3lyc");
    			add_location(span2, file$5, 18, 6, 513);
    			attr_dev(span3, "class", "line svelte-e3lyc");
    			add_location(span3, file$5, 17, 4, 487);
    			attr_dev(span4, "class", "subtitle svelte-e3lyc");
    			add_location(span4, file$5, 28, 6, 755);
    			attr_dev(span5, "class", "bold");
    			add_location(span5, file$5, 29, 6, 803);
    			attr_dev(span6, "class", "line svelte-e3lyc");
    			add_location(span6, file$5, 27, 4, 729);
    			attr_dev(span7, "class", "subtitle svelte-e3lyc");
    			add_location(span7, file$5, 32, 6, 904);
    			attr_dev(span8, "class", "bold");
    			add_location(span8, file$5, 33, 6, 952);
    			attr_dev(span9, "class", "line svelte-e3lyc");
    			add_location(span9, file$5, 31, 4, 878);
    			attr_dev(div, "class", "current-song svelte-e3lyc");
    			add_location(div, file$5, 6, 2, 217);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span1);
    			append_dev(span1, span0);
    			append_dev(span1, t1);
    			mount_component(writabletext0, span1, null);
    			append_dev(div, t2);
    			append_dev(div, span3);
    			append_dev(span3, span2);
    			append_dev(span3, t4);
    			mount_component(writabletext1, span3, null);
    			append_dev(div, t5);
    			append_dev(div, span6);
    			append_dev(span6, span4);
    			append_dev(span6, t7);
    			append_dev(span6, span5);
    			append_dev(span5, t8);
    			append_dev(div, t9);
    			append_dev(div, span9);
    			append_dev(span9, span7);
    			append_dev(span9, t11);
    			append_dev(span9, span8);
    			append_dev(span8, t12);
    			append_dev(div, t13);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const writabletext0_changes = {};

    			if (dirty & /*$PLAYLIST*/ 1) writabletext0_changes.option = {
    				text: /*$PLAYLIST*/ ctx[0].currentSong.title,
    				key: "title",
    				isCurrentSong: true
    			};

    			writabletext0.$set(writabletext0_changes);
    			const writabletext1_changes = {};

    			if (dirty & /*$PLAYLIST*/ 1) writabletext1_changes.option = {
    				text: /*$PLAYLIST*/ ctx[0].currentSong.artist,
    				key: "artist",
    				isCurrentSong: true
    			};

    			writabletext1.$set(writabletext1_changes);
    			if ((!current || dirty & /*$PLAYLIST*/ 1) && t8_value !== (t8_value = /*$PLAYLIST*/ ctx[0].currentSong.duration + "")) set_data_dev(t8, t8_value);
    			if ((!current || dirty & /*$PLAYLIST*/ 1) && t12_value !== (t12_value = /*$PLAYLIST*/ ctx[0].currentSong.type + "")) set_data_dev(t12, t12_value);

    			if (/*$PLAYLIST*/ ctx[0].currentSong.type === "youtube") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(writabletext0.$$.fragment, local);
    			transition_in(writabletext1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(writabletext0.$$.fragment, local);
    			transition_out(writabletext1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(writabletext0);
    			destroy_component(writabletext1);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(6:0) {#if $PLAYLIST.currentSong !== null}",
    		ctx
    	});

    	return block;
    }

    // (36:4) {#if $PLAYLIST.currentSong.type === "youtube"}
    function create_if_block_1$1(ctx) {
    	let span;
    	let a;
    	let svg0;
    	let path0;
    	let svg1;
    	let path1;
    	let t0;
    	let t1_value = /*$PLAYLIST*/ ctx[0].currentSong.songId + "";
    	let t1;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			a = element("a");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t0 = text("https://youtube.com/watch?v=");
    			t1 = text(t1_value);
    			attr_dev(path0, "d", "M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z");
    			add_location(path0, file$5, 44, 13, 1352);
    			attr_dev(svg0, "class", "icon youtube svelte-e3lyc");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 576 512");
    			add_location(svg0, file$5, 40, 11, 1220);
    			attr_dev(path1, "d", "M172.5 131.1C228.1 75.51 320.5 75.51 376.1 131.1C426.1 181.1 433.5 260.8 392.4 318.3L391.3 319.9C381 334.2 361 337.6 346.7 327.3C332.3 317 328.9 297 339.2 282.7L340.3 281.1C363.2 249 359.6 205.1 331.7 177.2C300.3 145.8 249.2 145.8 217.7 177.2L105.5 289.5C73.99 320.1 73.99 372 105.5 403.5C133.3 431.4 177.3 435 209.3 412.1L210.9 410.1C225.3 400.7 245.3 404 255.5 418.4C265.8 432.8 262.5 452.8 248.1 463.1L246.5 464.2C188.1 505.3 110.2 498.7 60.21 448.8C3.741 392.3 3.741 300.7 60.21 244.3L172.5 131.1zM467.5 380C411 436.5 319.5 436.5 263 380C213 330 206.5 251.2 247.6 193.7L248.7 192.1C258.1 177.8 278.1 174.4 293.3 184.7C307.7 194.1 311.1 214.1 300.8 229.3L299.7 230.9C276.8 262.1 280.4 306.9 308.3 334.8C339.7 366.2 390.8 366.2 422.3 334.8L534.5 222.5C566 191 566 139.1 534.5 108.5C506.7 80.63 462.7 76.99 430.7 99.9L429.1 101C414.7 111.3 394.7 107.1 384.5 93.58C374.2 79.2 377.5 59.21 391.9 48.94L393.5 47.82C451 6.731 529.8 13.25 579.8 63.24C636.3 119.7 636.3 211.3 579.8 267.7L467.5 380z");
    			add_location(path1, file$5, 51, 13, 2009);
    			attr_dev(svg1, "class", "icon common svelte-e3lyc");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 640 512");
    			add_location(svg1, file$5, 47, 11, 1878);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "href", a_href_value = "https://youtube.com/watch?v=" + /*$PLAYLIST*/ ctx[0].currentSong.songId);
    			add_location(a, file$5, 37, 8, 1104);
    			attr_dev(span, "class", "line svelte-e3lyc");
    			add_location(span, file$5, 36, 6, 1076);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, a);
    			append_dev(a, svg0);
    			append_dev(svg0, path0);
    			append_dev(a, svg1);
    			append_dev(svg1, path1);
    			append_dev(a, t0);
    			append_dev(a, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$PLAYLIST*/ 1 && t1_value !== (t1_value = /*$PLAYLIST*/ ctx[0].currentSong.songId + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*$PLAYLIST*/ 1 && a_href_value !== (a_href_value = "https://youtube.com/watch?v=" + /*$PLAYLIST*/ ctx[0].currentSong.songId)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(36:4) {#if $PLAYLIST.currentSong.type === \\\"youtube\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$PLAYLIST*/ ctx[0].currentSong !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $PLAYLIST;
    	validate_store(PLAYLIST, 'PLAYLIST');
    	component_subscribe($$self, PLAYLIST, $$value => $$invalidate(0, $PLAYLIST = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NowPlaying', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NowPlaying> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		EmptyCover,
    		WritableText,
    		PLAYLIST,
    		$PLAYLIST
    	});

    	return [$PLAYLIST];
    }

    class NowPlaying extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NowPlaying",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    function commonjsRequire (target) {
    	throw new Error('Could not dynamically require "' + target + '". Please configure the dynamicRequireTargets option of @rollup/plugin-commonjs appropriately for this require call to behave properly.');
    }

    var Sister;

    /**
    * @link https://github.com/gajus/sister for the canonical source repository
    * @license https://github.com/gajus/sister/blob/master/LICENSE BSD 3-Clause
    */
    Sister = function () {
        var sister = {},
            events = {};

        /**
         * @name handler
         * @function
         * @param {Object} data Event data.
         */

        /**
         * @param {String} name Event name.
         * @param {handler} handler
         * @return {listener}
         */
        sister.on = function (name, handler) {
            var listener = {name: name, handler: handler};
            events[name] = events[name] || [];
            events[name].unshift(listener);
            return listener;
        };

        /**
         * @param {listener}
         */
        sister.off = function (listener) {
            var index = events[listener.name].indexOf(listener);

            if (index !== -1) {
                events[listener.name].splice(index, 1);
            }
        };

        /**
         * @param {String} name Event name.
         * @param {Object} data Event data.
         */
        sister.trigger = function (name, data) {
            var listeners = events[name],
                i;

            if (listeners) {
                i = listeners.length;
                while (i--) {
                    listeners[i].handler(data);
                }
            }
        };

        return sister;
    };

    var sister = Sister;

    var loadScript = function load (src, opts, cb) {
      var head = document.head || document.getElementsByTagName('head')[0];
      var script = document.createElement('script');

      if (typeof opts === 'function') {
        cb = opts;
        opts = {};
      }

      opts = opts || {};
      cb = cb || function() {};

      script.type = opts.type || 'text/javascript';
      script.charset = opts.charset || 'utf8';
      script.async = 'async' in opts ? !!opts.async : true;
      script.src = src;

      if (opts.attrs) {
        setAttributes(script, opts.attrs);
      }

      if (opts.text) {
        script.text = '' + opts.text;
      }

      var onend = 'onload' in script ? stdOnEnd : ieOnEnd;
      onend(script, cb);

      // some good legacy browsers (firefox) fail the 'in' detection above
      // so as a fallback we always set onload
      // old IE will ignore this and new IE will set onload
      if (!script.onload) {
        stdOnEnd(script, cb);
      }

      head.appendChild(script);
    };

    function setAttributes(script, attrs) {
      for (var attr in attrs) {
        script.setAttribute(attr, attrs[attr]);
      }
    }

    function stdOnEnd (script, cb) {
      script.onload = function () {
        this.onerror = this.onload = null;
        cb(null, script);
      };
      script.onerror = function () {
        // this.onload = null here is necessary
        // because even IE9 works not like others
        this.onerror = this.onload = null;
        cb(new Error('Failed to load ' + this.src), script);
      };
    }

    function ieOnEnd (script, cb) {
      script.onreadystatechange = function () {
        if (this.readyState != 'complete' && this.readyState != 'loaded') return
        this.onreadystatechange = null;
        cb(null, script); // there is no way to catch loading errors in IE8
      };
    }

    var loadYouTubeIframeApi = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });



    var _loadScript2 = _interopRequireDefault(loadScript);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    exports.default = function (emitter) {
      /**
       * A promise that is resolved when window.onYouTubeIframeAPIReady is called.
       * The promise is resolved with a reference to window.YT object.
       */
      var iframeAPIReady = new Promise(function (resolve) {
        if (window.YT && window.YT.Player && window.YT.Player instanceof Function) {
          resolve(window.YT);

          return;
        } else {
          var protocol = window.location.protocol === 'http:' ? 'http:' : 'https:';

          (0, _loadScript2.default)(protocol + '//www.youtube.com/iframe_api', function (error) {
            if (error) {
              emitter.trigger('error', error);
            }
          });
        }

        var previous = window.onYouTubeIframeAPIReady;

        // The API will call this function when page has finished downloading
        // the JavaScript for the player API.
        window.onYouTubeIframeAPIReady = function () {
          if (previous) {
            previous();
          }

          resolve(window.YT);
        };
      });

      return iframeAPIReady;
    };

    module.exports = exports['default'];
    });

    /**
     * Helpers.
     */
    var s = 1000;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var y = d * 365.25;

    /**
     * Parse or format the given `val`.
     *
     * Options:
     *
     *  - `long` verbose formatting [false]
     *
     * @param {String|Number} val
     * @param {Object} [options]
     * @throws {Error} throw an error if val is not a non-empty string or a number
     * @return {String|Number}
     * @api public
     */

    var ms = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === 'string' && val.length > 0) {
        return parse(val);
      } else if (type === 'number' && isNaN(val) === false) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        'val is not a non-empty string or a valid number. val=' +
          JSON.stringify(val)
      );
    };

    /**
     * Parse the given `str` and return milliseconds.
     *
     * @param {String} str
     * @return {Number}
     * @api private
     */

    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || 'ms').toLowerCase();
      switch (type) {
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
          return n * y;
        case 'days':
        case 'day':
        case 'd':
          return n * d;
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
          return n * h;
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
          return n * m;
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
          return n * s;
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
          return n;
        default:
          return undefined;
      }
    }

    /**
     * Short format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */

    function fmtShort(ms) {
      if (ms >= d) {
        return Math.round(ms / d) + 'd';
      }
      if (ms >= h) {
        return Math.round(ms / h) + 'h';
      }
      if (ms >= m) {
        return Math.round(ms / m) + 'm';
      }
      if (ms >= s) {
        return Math.round(ms / s) + 's';
      }
      return ms + 'ms';
    }

    /**
     * Long format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */

    function fmtLong(ms) {
      return plural(ms, d, 'day') ||
        plural(ms, h, 'hour') ||
        plural(ms, m, 'minute') ||
        plural(ms, s, 'second') ||
        ms + ' ms';
    }

    /**
     * Pluralization helper.
     */

    function plural(ms, n, name) {
      if (ms < n) {
        return;
      }
      if (ms < n * 1.5) {
        return Math.floor(ms / n) + ' ' + name;
      }
      return Math.ceil(ms / n) + ' ' + name + 's';
    }

    var debug = createCommonjsModule(function (module, exports) {
    /**
     * This is the common logic for both the Node.js and web browser
     * implementations of `debug()`.
     *
     * Expose `debug()` as the module.
     */

    exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
    exports.coerce = coerce;
    exports.disable = disable;
    exports.enable = enable;
    exports.enabled = enabled;
    exports.humanize = ms;

    /**
     * The currently active debug mode names, and names to skip.
     */

    exports.names = [];
    exports.skips = [];

    /**
     * Map of special "%n" handling functions, for the debug "format" argument.
     *
     * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
     */

    exports.formatters = {};

    /**
     * Previous log timestamp.
     */

    var prevTime;

    /**
     * Select a color.
     * @param {String} namespace
     * @return {Number}
     * @api private
     */

    function selectColor(namespace) {
      var hash = 0, i;

      for (i in namespace) {
        hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }

      return exports.colors[Math.abs(hash) % exports.colors.length];
    }

    /**
     * Create a debugger with the given `namespace`.
     *
     * @param {String} namespace
     * @return {Function}
     * @api public
     */

    function createDebug(namespace) {

      function debug() {
        // disabled?
        if (!debug.enabled) return;

        var self = debug;

        // set `diff` timestamp
        var curr = +new Date();
        var ms = curr - (prevTime || curr);
        self.diff = ms;
        self.prev = prevTime;
        self.curr = curr;
        prevTime = curr;

        // turn the `arguments` into a proper Array
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }

        args[0] = exports.coerce(args[0]);

        if ('string' !== typeof args[0]) {
          // anything else let's inspect with %O
          args.unshift('%O');
        }

        // apply any `formatters` transformations
        var index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
          // if we encounter an escaped % then don't increase the array index
          if (match === '%%') return match;
          index++;
          var formatter = exports.formatters[format];
          if ('function' === typeof formatter) {
            var val = args[index];
            match = formatter.call(self, val);

            // now we need to remove `args[index]` since it's inlined in the `format`
            args.splice(index, 1);
            index--;
          }
          return match;
        });

        // apply env-specific formatting (colors, etc.)
        exports.formatArgs.call(self, args);

        var logFn = debug.log || exports.log || console.log.bind(console);
        logFn.apply(self, args);
      }

      debug.namespace = namespace;
      debug.enabled = exports.enabled(namespace);
      debug.useColors = exports.useColors();
      debug.color = selectColor(namespace);

      // env-specific initialization logic for debug instances
      if ('function' === typeof exports.init) {
        exports.init(debug);
      }

      return debug;
    }

    /**
     * Enables a debug mode by namespaces. This can include modes
     * separated by a colon and wildcards.
     *
     * @param {String} namespaces
     * @api public
     */

    function enable(namespaces) {
      exports.save(namespaces);

      exports.names = [];
      exports.skips = [];

      var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
      var len = split.length;

      for (var i = 0; i < len; i++) {
        if (!split[i]) continue; // ignore empty strings
        namespaces = split[i].replace(/\*/g, '.*?');
        if (namespaces[0] === '-') {
          exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
        } else {
          exports.names.push(new RegExp('^' + namespaces + '$'));
        }
      }
    }

    /**
     * Disable debug output.
     *
     * @api public
     */

    function disable() {
      exports.enable('');
    }

    /**
     * Returns true if the given mode name is enabled, false otherwise.
     *
     * @param {String} name
     * @return {Boolean}
     * @api public
     */

    function enabled(name) {
      var i, len;
      for (i = 0, len = exports.skips.length; i < len; i++) {
        if (exports.skips[i].test(name)) {
          return false;
        }
      }
      for (i = 0, len = exports.names.length; i < len; i++) {
        if (exports.names[i].test(name)) {
          return true;
        }
      }
      return false;
    }

    /**
     * Coerce `val`.
     *
     * @param {Mixed} val
     * @return {Mixed}
     * @api private
     */

    function coerce(val) {
      if (val instanceof Error) return val.stack || val.message;
      return val;
    }
    });

    /**
     * This is the web browser implementation of `debug()`.
     *
     * Expose `debug()` as the module.
     */

    var browser = createCommonjsModule(function (module, exports) {
    exports = module.exports = debug;
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = 'undefined' != typeof chrome
                   && 'undefined' != typeof chrome.storage
                      ? chrome.storage.local
                      : localstorage();

    /**
     * Colors.
     */

    exports.colors = [
      'lightseagreen',
      'forestgreen',
      'goldenrod',
      'dodgerblue',
      'darkorchid',
      'crimson'
    ];

    /**
     * Currently only WebKit-based Web Inspectors, Firefox >= v31,
     * and the Firebug extension (any Firefox version) are known
     * to support "%c" CSS customizations.
     *
     * TODO: add a `localStorage` variable to explicitly enable/disable colors
     */

    function useColors() {
      // NB: In an Electron preload script, document will be defined but not fully
      // initialized. Since we know we're in Chrome, we'll just detect this case
      // explicitly
      if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
        return true;
      }

      // is webkit? http://stackoverflow.com/a/16459606/376773
      // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
      return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
        // is firebug? http://stackoverflow.com/a/398120/376773
        (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
        // is firefox >= v31?
        // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
        (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
        // double check webkit in userAgent just in case we are in a worker
        (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
    }

    /**
     * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
     */

    exports.formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (err) {
        return '[UnexpectedJSONParseError]: ' + err.message;
      }
    };


    /**
     * Colorize log arguments if enabled.
     *
     * @api public
     */

    function formatArgs(args) {
      var useColors = this.useColors;

      args[0] = (useColors ? '%c' : '')
        + this.namespace
        + (useColors ? ' %c' : ' ')
        + args[0]
        + (useColors ? '%c ' : ' ')
        + '+' + exports.humanize(this.diff);

      if (!useColors) return;

      var c = 'color: ' + this.color;
      args.splice(1, 0, c, 'color: inherit');

      // the final "%c" is somewhat tricky, because there could be other
      // arguments passed either before or after the %c, so we need to
      // figure out the correct index to insert the CSS into
      var index = 0;
      var lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, function(match) {
        if ('%%' === match) return;
        index++;
        if ('%c' === match) {
          // we only are interested in the *last* %c
          // (the user may have provided their own)
          lastC = index;
        }
      });

      args.splice(lastC, 0, c);
    }

    /**
     * Invokes `console.log()` when available.
     * No-op when `console.log` is not a "function".
     *
     * @api public
     */

    function log() {
      // this hackery is required for IE8/9, where
      // the `console.log` function doesn't have 'apply'
      return 'object' === typeof console
        && console.log
        && Function.prototype.apply.call(console.log, console, arguments);
    }

    /**
     * Save `namespaces`.
     *
     * @param {String} namespaces
     * @api private
     */

    function save(namespaces) {
      try {
        if (null == namespaces) {
          exports.storage.removeItem('debug');
        } else {
          exports.storage.debug = namespaces;
        }
      } catch(e) {}
    }

    /**
     * Load `namespaces`.
     *
     * @return {String} returns the previously persisted debug modes
     * @api private
     */

    function load() {
      var r;
      try {
        r = exports.storage.debug;
      } catch(e) {}

      // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
      if (!r && typeof process !== 'undefined' && 'env' in process) {
        r = process.env.DEBUG;
      }

      return r;
    }

    /**
     * Enable namespaces listed in `localStorage.debug` initially.
     */

    exports.enable(load());

    /**
     * Localstorage attempts to return the localstorage.
     *
     * This is necessary because safari throws
     * when a user disables cookies/localstorage
     * and you attempt to access it.
     *
     * @return {LocalStorage}
     * @api private
     */

    function localstorage() {
      try {
        return window.localStorage;
      } catch (e) {}
    }
    });

    var functionNames = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });


    /**
     * @see https://developers.google.com/youtube/iframe_api_reference#Functions
     */
    exports.default = ['cueVideoById', 'loadVideoById', 'cueVideoByUrl', 'loadVideoByUrl', 'playVideo', 'pauseVideo', 'stopVideo', 'getVideoLoadedFraction', 'cuePlaylist', 'loadPlaylist', 'nextVideo', 'previousVideo', 'playVideoAt', 'setShuffle', 'setLoop', 'getPlaylist', 'getPlaylistIndex', 'setOption', 'mute', 'unMute', 'isMuted', 'setVolume', 'getVolume', 'seekTo', 'getPlayerState', 'getPlaybackRate', 'setPlaybackRate', 'getAvailablePlaybackRates', 'getPlaybackQuality', 'setPlaybackQuality', 'getAvailableQualityLevels', 'getCurrentTime', 'getDuration', 'removeEventListener', 'getVideoUrl', 'getVideoEmbedCode', 'getOptions', 'getOption', 'addEventListener', 'destroy', 'setSize', 'getIframe'];
    module.exports = exports['default'];
    });

    var eventNames = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });


    /**
     * @see https://developers.google.com/youtube/iframe_api_reference#Events
     * `volumeChange` is not officially supported but seems to work
     * it emits an object: `{volume: 82.6923076923077, muted: false}`
     */
    exports.default = ['ready', 'stateChange', 'playbackQualityChange', 'playbackRateChange', 'error', 'apiChange', 'volumeChange'];
    module.exports = exports['default'];
    });

    var PlayerStates = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = {
      BUFFERING: 3,
      ENDED: 0,
      PAUSED: 2,
      PLAYING: 1,
      UNSTARTED: -1,
      VIDEO_CUED: 5
    };
    module.exports = exports["default"];
    });

    var FunctionStateMap = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });



    var _PlayerStates2 = _interopRequireDefault(PlayerStates);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    exports.default = {
      pauseVideo: {
        acceptableStates: [_PlayerStates2.default.ENDED, _PlayerStates2.default.PAUSED],
        stateChangeRequired: false
      },
      playVideo: {
        acceptableStates: [_PlayerStates2.default.ENDED, _PlayerStates2.default.PLAYING],
        stateChangeRequired: false
      },
      seekTo: {
        acceptableStates: [_PlayerStates2.default.ENDED, _PlayerStates2.default.PLAYING, _PlayerStates2.default.PAUSED],
        stateChangeRequired: true,

        // TRICKY: `seekTo` may not cause a state change if no buffering is
        // required.
        timeout: 3000
      }
    };
    module.exports = exports['default'];
    });

    var YouTubePlayer_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });



    var _debug2 = _interopRequireDefault(browser);



    var _functionNames2 = _interopRequireDefault(functionNames);



    var _eventNames2 = _interopRequireDefault(eventNames);



    var _FunctionStateMap2 = _interopRequireDefault(FunctionStateMap);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    /* eslint-disable promise/prefer-await-to-then */

    var debug = (0, _debug2.default)('youtube-player');

    var YouTubePlayer = {};

    /**
     * Construct an object that defines an event handler for all of the YouTube
     * player events. Proxy captured events through an event emitter.
     *
     * @todo Capture event parameters.
     * @see https://developers.google.com/youtube/iframe_api_reference#Events
     */
    YouTubePlayer.proxyEvents = function (emitter) {
      var events = {};

      var _loop = function _loop(eventName) {
        var onEventName = 'on' + eventName.slice(0, 1).toUpperCase() + eventName.slice(1);

        events[onEventName] = function (event) {
          debug('event "%s"', onEventName, event);

          emitter.trigger(eventName, event);
        };
      };

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _eventNames2.default[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var eventName = _step.value;

          _loop(eventName);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return events;
    };

    /**
     * Delays player API method execution until player state is ready.
     *
     * @todo Proxy all of the methods using Object.keys.
     * @todo See TRICKY below.
     * @param playerAPIReady Promise that resolves when player is ready.
     * @param strictState A flag designating whether or not to wait for
     * an acceptable state when calling supported functions.
     * @returns {Object}
     */
    YouTubePlayer.promisifyPlayer = function (playerAPIReady) {
      var strictState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var functions = {};

      var _loop2 = function _loop2(functionName) {
        if (strictState && _FunctionStateMap2.default[functionName]) {
          functions[functionName] = function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return playerAPIReady.then(function (player) {
              var stateInfo = _FunctionStateMap2.default[functionName];
              var playerState = player.getPlayerState();

              // eslint-disable-next-line no-warning-comments
              // TODO: Just spread the args into the function once Babel is fixed:
              // https://github.com/babel/babel/issues/4270
              //
              // eslint-disable-next-line prefer-spread
              var value = player[functionName].apply(player, args);

              // TRICKY: For functions like `seekTo`, a change in state must be
              // triggered given that the resulting state could match the initial
              // state.
              if (stateInfo.stateChangeRequired ||

              // eslint-disable-next-line no-extra-parens
              Array.isArray(stateInfo.acceptableStates) && stateInfo.acceptableStates.indexOf(playerState) === -1) {
                return new Promise(function (resolve) {
                  var onPlayerStateChange = function onPlayerStateChange() {
                    var playerStateAfterChange = player.getPlayerState();

                    var timeout = void 0;

                    if (typeof stateInfo.timeout === 'number') {
                      timeout = setTimeout(function () {
                        player.removeEventListener('onStateChange', onPlayerStateChange);

                        resolve();
                      }, stateInfo.timeout);
                    }

                    if (Array.isArray(stateInfo.acceptableStates) && stateInfo.acceptableStates.indexOf(playerStateAfterChange) !== -1) {
                      player.removeEventListener('onStateChange', onPlayerStateChange);

                      clearTimeout(timeout);

                      resolve();
                    }
                  };

                  player.addEventListener('onStateChange', onPlayerStateChange);
                }).then(function () {
                  return value;
                });
              }

              return value;
            });
          };
        } else {
          functions[functionName] = function () {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }

            return playerAPIReady.then(function (player) {
              // eslint-disable-next-line no-warning-comments
              // TODO: Just spread the args into the function once Babel is fixed:
              // https://github.com/babel/babel/issues/4270
              //
              // eslint-disable-next-line prefer-spread
              return player[functionName].apply(player, args);
            });
          };
        }
      };

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _functionNames2.default[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var functionName = _step2.value;

          _loop2(functionName);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return functions;
    };

    exports.default = YouTubePlayer;
    module.exports = exports['default'];
    });

    var dist = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };



    var _sister2 = _interopRequireDefault(sister);



    var _loadYouTubeIframeApi2 = _interopRequireDefault(loadYouTubeIframeApi);



    var _YouTubePlayer2 = _interopRequireDefault(YouTubePlayer_1);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    /**
     * @typedef YT.Player
     * @see https://developers.google.com/youtube/iframe_api_reference
     * */

    /**
     * @see https://developers.google.com/youtube/iframe_api_reference#Loading_a_Video_Player
     */
    var youtubeIframeAPI = void 0;

    /**
     * A factory function used to produce an instance of YT.Player and queue function calls and proxy events of the resulting object.
     *
     * @param maybeElementId Either An existing YT.Player instance,
     * the DOM element or the id of the HTML element where the API will insert an <iframe>.
     * @param options See `options` (Ignored when using an existing YT.Player instance).
     * @param strictState A flag designating whether or not to wait for
     * an acceptable state when calling supported functions. Default: `false`.
     * See `FunctionStateMap.js` for supported functions and acceptable states.
     */

    exports.default = function (maybeElementId) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var strictState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var emitter = (0, _sister2.default)();

      if (!youtubeIframeAPI) {
        youtubeIframeAPI = (0, _loadYouTubeIframeApi2.default)(emitter);
      }

      if (options.events) {
        throw new Error('Event handlers cannot be overwritten.');
      }

      if (typeof maybeElementId === 'string' && !document.getElementById(maybeElementId)) {
        throw new Error('Element "' + maybeElementId + '" does not exist.');
      }

      options.events = _YouTubePlayer2.default.proxyEvents(emitter);

      var playerAPIReady = new Promise(function (resolve) {
        if ((typeof maybeElementId === 'undefined' ? 'undefined' : _typeof(maybeElementId)) === 'object' && maybeElementId.playVideo instanceof Function) {
          var player = maybeElementId;

          resolve(player);
        } else {
          // asume maybeElementId can be rendered inside
          // eslint-disable-next-line promise/catch-or-return
          youtubeIframeAPI.then(function (YT) {
            // eslint-disable-line promise/prefer-await-to-then
            var player = new YT.Player(maybeElementId, options);

            emitter.on('ready', function () {
              resolve(player);
            });

            return null;
          });
        }
      });

      var playerApi = _YouTubePlayer2.default.promisifyPlayer(playerAPIReady, strictState);

      playerApi.on = emitter.on;
      playerApi.off = emitter.off;

      return playerApi;
    };

    module.exports = exports['default'];
    });

    var YoutubePlayer = /*@__PURE__*/getDefaultExportFromCjs(dist);

    /* node_modules/svelte-youtube/src/index.svelte generated by Svelte v3.48.0 */
    const file$4 = "node_modules/svelte-youtube/src/index.svelte";

    function create_fragment$6(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "id", /*id*/ ctx[0]);
    			add_location(div0, file$4, 143, 2, 4083);
    			attr_dev(div1, "class", /*className*/ ctx[1]);
    			add_location(div1, file$4, 142, 0, 4057);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			/*div0_binding*/ ctx[5](div0);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*id*/ 1) {
    				attr_dev(div0, "id", /*id*/ ctx[0]);
    			}

    			if (dirty & /*className*/ 2) {
    				attr_dev(div1, "class", /*className*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			/*div0_binding*/ ctx[5](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const PlayerState = {
    	UNSTARTED: -1,
    	ENDED: 0,
    	PLAYING: 1,
    	PAUSED: 2,
    	BUFFERING: 3,
    	CUED: 5
    };

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Src', slots, []);
    	let { id = undefined } = $$props;
    	let { videoId } = $$props;
    	let { options = undefined } = $$props;
    	let { class: className } = $$props;
    	let playerElem; // player DOM element reference
    	let player; // player API instance

    	// Create and tear down player as component mounts or unmounts
    	onMount(() => createPlayer());

    	function createPlayer() {
    		player = YoutubePlayer(playerElem, options);

    		// Register event handlers
    		player.on('ready', onPlayerReady);

    		player.on('error', onPlayerError);
    		player.on('stateChange', onPlayerStateChange);
    		player.on('playbackRateChange', onPlayerPlaybackRateChange);
    		player.on('playbackQualityChange', onPlayerPlaybackQualityChange);

    		// Tear down player when done
    		return () => player.destroy();
    	}

    	function play(videoId) {
    		// this is needed because the loadVideoById function always starts playing,
    		// even if you have set autoplay to 1 whereas the cueVideoById function
    		// never starts autoplaying
    		if (player && videoId) {
    			if (options && options.playerVars && options.playerVars.autoplay === 1) {
    				player.loadVideoById(videoId);
    			} else {
    				player.cueVideoById(videoId);
    			}
    		}
    	}

    	// -------------------------------------------
    	// Event handling
    	// -------------------------------------------
    	const dispatch = createEventDispatcher();

    	/**
     * https://developers.google.com/youtube/iframe_api_reference#onReady
     *
     * @param {Object} event
     *   @param {Object} target - player object
     */
    	function onPlayerReady(event) {
    		dispatch('ready', event);

    		// Start playing
    		play(videoId);
    	}

    	/**
     * https://developers.google.com/youtube/iframe_api_reference#onError
     *
     * @param {Object} event
     *   @param {Integer} data  - error type
     *   @param {Object} target - player object
     */
    	function onPlayerError(event) {
    		dispatch('error', event);
    	}

    	/**
     * https://developers.google.com/youtube/iframe_api_reference#onStateChange
     *
     * @param {Object} event
     *   @param {Integer} data  - status change type
     *   @param {Object} target - actual YT player
     */
    	function onPlayerStateChange(event) {
    		dispatch('stateChange', event);

    		switch (event.data) {
    			case PlayerState.ENDED:
    				dispatch('end', event);
    				break;
    			case PlayerState.PLAYING:
    				dispatch('play', event);
    				break;
    			case PlayerState.PAUSED:
    				dispatch('pause', event);
    				break;
    		}
    	}

    	/**
     * https://developers.google.com/youtube/iframe_api_reference#onPlaybackRateChange
     *
     * @param {Object} event
     *   @param {Float} data    - playback rate
     *   @param {Object} target - actual YT player
     */
    	function onPlayerPlaybackRateChange(event) {
    		dispatch('playbackRateChange', event);
    	}

    	/**
     * https://developers.google.com/youtube/iframe_api_reference#onPlaybackQualityChange
     *
     * @param {Object} event
     *   @param {String} data   - playback quality
     *   @param {Object} target - actual YT player
     */
    	function onPlayerPlaybackQualityChange(event) {
    		dispatch('playbackQualityChange', event);
    	}

    	const writable_props = ['id', 'videoId', 'options', 'class'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Src> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			playerElem = $$value;
    			$$invalidate(2, playerElem);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('videoId' in $$props) $$invalidate(3, videoId = $$props.videoId);
    		if ('options' in $$props) $$invalidate(4, options = $$props.options);
    		if ('class' in $$props) $$invalidate(1, className = $$props.class);
    	};

    	$$self.$capture_state = () => ({
    		PlayerState,
    		onMount,
    		createEventDispatcher,
    		YoutubePlayer,
    		id,
    		videoId,
    		options,
    		className,
    		playerElem,
    		player,
    		createPlayer,
    		play,
    		dispatch,
    		onPlayerReady,
    		onPlayerError,
    		onPlayerStateChange,
    		onPlayerPlaybackRateChange,
    		onPlayerPlaybackQualityChange
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('videoId' in $$props) $$invalidate(3, videoId = $$props.videoId);
    		if ('options' in $$props) $$invalidate(4, options = $$props.options);
    		if ('className' in $$props) $$invalidate(1, className = $$props.className);
    		if ('playerElem' in $$props) $$invalidate(2, playerElem = $$props.playerElem);
    		if ('player' in $$props) player = $$props.player;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*videoId*/ 8) {
    			// Update videoId and load new video if URL changes
    			play(videoId);
    		}
    	};

    	return [id, className, playerElem, videoId, options, div0_binding];
    }

    class Src extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { id: 0, videoId: 3, options: 4, class: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Src",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*videoId*/ ctx[3] === undefined && !('videoId' in props)) {
    			console.warn("<Src> was created without expected prop 'videoId'");
    		}

    		if (/*className*/ ctx[1] === undefined && !('class' in props)) {
    			console.warn("<Src> was created without expected prop 'class'");
    		}
    	}

    	get id() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get videoId() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set videoId(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Src>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Src>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/common/Popup.svelte generated by Svelte v3.48.0 */
    const file$3 = "src/components/common/Popup.svelte";

    function create_fragment$5(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let t;
    	let div1;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "exit-btn svelte-g81ir2");
    			add_location(div0, file$3, 16, 4, 249);
    			attr_dev(div1, "class", "interface link svelte-g81ir2");
    			add_location(div1, file$3, 22, 4, 351);
    			attr_dev(div2, "class", "viewport svelte-g81ir2");
    			add_location(div2, file$3, 10, 2, 150);
    			attr_dev(div3, "class", "popup svelte-g81ir2");
    			add_location(div3, file$3, 4, 0, 74);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(div2, "click", click_handler_1, false, false, false),
    					listen_dev(div3, "click", /*click_handler_2*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const click_handler_1 = event => {
    	event.stopPropagation();
    };

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Popup', slots, ['default']);
    	let { popupFlag } = $$props;
    	const writable_props = ['popupFlag'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Popup> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		popupFlag.set(false);
    	};

    	const click_handler_2 = () => {
    		popupFlag.set(false);
    	};

    	$$self.$$set = $$props => {
    		if ('popupFlag' in $$props) $$invalidate(0, popupFlag = $$props.popupFlag);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ popupFlag });

    	$$self.$inject_state = $$props => {
    		if ('popupFlag' in $$props) $$invalidate(0, popupFlag = $$props.popupFlag);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [popupFlag, $$scope, slots, click_handler, click_handler_2];
    }

    class Popup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { popupFlag: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Popup",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*popupFlag*/ ctx[0] === undefined && !('popupFlag' in props)) {
    			console.warn("<Popup> was created without expected prop 'popupFlag'");
    		}
    	}

    	get popupFlag() {
    		throw new Error("<Popup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set popupFlag(value) {
    		throw new Error("<Popup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/PlayerApp/YTSearch.svelte generated by Svelte v3.48.0 */
    const file$2 = "src/components/PlayerApp/YTSearch.svelte";

    // (82:4) {#if ytSearchID !== ""}
    function create_if_block$1(ctx) {
    	let youtube;
    	let current;

    	youtube = new Src({
    			props: { videoId: /*ytSearchID*/ ctx[1] },
    			$$inline: true
    		});

    	youtube.$on("ready", /*onReadyYoutubePlayer*/ ctx[3]);
    	youtube.$on("stateChange", /*onStateChangeYoutubePlayer*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(youtube.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(youtube, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const youtube_changes = {};
    			if (dirty & /*ytSearchID*/ 2) youtube_changes.videoId = /*ytSearchID*/ ctx[1];
    			youtube.$set(youtube_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(youtube.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(youtube.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(youtube, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(82:4) {#if ytSearchID !== \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (71:0) <Popup popupFlag={FLAG_YT_SEARCH_POPUP}>
    function create_default_slot$2(ctx) {
    	let div0;
    	let t1;
    	let div1;
    	let input;
    	let t2;
    	let button;
    	let t4;
    	let div2;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*ytSearchID*/ ctx[1] !== "" && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "유튜브 주소로 추가";
    			t1 = space();
    			div1 = element("div");
    			input = element("input");
    			t2 = space();
    			button = element("button");
    			button.textContent = "추가";
    			t4 = space();
    			div2 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "viewport-title svelte-xfvvgr");
    			add_location(div0, file$2, 71, 2, 2353);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "ex) https://www.youtube.com/watch?v=-Y9VtoPvtuM");
    			attr_dev(input, "class", "svelte-xfvvgr");
    			add_location(input, file$2, 73, 4, 2428);
    			attr_dev(button, "class", "svelte-xfvvgr");
    			add_location(button, file$2, 78, 4, 2557);
    			attr_dev(div1, "class", "frm-input svelte-xfvvgr");
    			add_location(div1, file$2, 72, 2, 2400);
    			attr_dev(div2, "class", "displaynone svelte-xfvvgr");
    			add_location(div2, file$2, 80, 2, 2613);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, input);
    			set_input_value(input, /*ytURL*/ ctx[0]);
    			append_dev(div1, t2);
    			append_dev(div1, button);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div2, anchor);
    			if (if_block) if_block.m(div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[5]),
    					listen_dev(button, "click", /*onClickAddBtn*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ytURL*/ 1 && input.value !== /*ytURL*/ ctx[0]) {
    				set_input_value(input, /*ytURL*/ ctx[0]);
    			}

    			if (/*ytSearchID*/ ctx[1] !== "") {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*ytSearchID*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div2, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(71:0) <Popup popupFlag={FLAG_YT_SEARCH_POPUP}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let popup;
    	let current;

    	popup = new Popup({
    			props: {
    				popupFlag: FLAG_YT_SEARCH_POPUP,
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(popup.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(popup, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const popup_changes = {};

    			if (dirty & /*$$scope, ytSearchID, ytURL*/ 259) {
    				popup_changes.$$scope = { dirty, ctx };
    			}

    			popup.$set(popup_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(popup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(popup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(popup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $PLAYLIST;
    	validate_store(PLAYLIST, 'PLAYLIST');
    	component_subscribe($$self, PLAYLIST, $$value => $$invalidate(7, $PLAYLIST = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('YTSearch', slots, []);
    	let ytURL;
    	let ytSearchID = "";
    	let ytPlayer = null;

    	/**
     * 재생 대기열에 ytSearchID에 해당하는 YouTube 영상 정보를 추가하는 함수
     */
    	const onClickAddBtn = () => {
    		const ytURLRegExp = /^(http:|https:)?(\/\/)?(www\.)?(youtube.com|youtu.be)\/(watch|embed)?(\?v=|\/)?(\S+)?$/g;
    		const songIdRegExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    		const songIdMatch = ytURL.match(songIdRegExp);

    		if (!ytURLRegExp.test(ytURL) || !songIdMatch || songIdMatch[7].length !== 11) {
    			errorToast("입력한 유튜브 주소가 유효하지 않습니다.");
    			return;
    		}

    		$$invalidate(1, ytSearchID = songIdMatch[7]);
    		LOADING_SCREEN_SAVER_MSG.set("재생대기열에 추가 중...");
    		FLAG_LOADING_SCREEN_SAVER.set(true);

    		setTimeout(
    			() => {
    				ytPlayer.mute();
    				ytPlayer.playVideo();
    			},
    			1000
    		);
    	};

    	/**
     * YouTube Player iframe API onReady 함수.
     * onReady 시 ytPlayer에 Player 객체를 가져옴
     * @param event
     */
    	const onReadyYoutubePlayer = event => {
    		ytPlayer = event.detail.target;
    	};

    	/**
     * YouTube Player iframe API onStateChange 함수.
     * 재생준비완료상태(5)가 되면 Player를 음소거한 후 재생시킨 뒤,
     * 재생상태(1)가 되면 일시정지 한 후 해당 영상 정보를 재생대기열에 추가시킴.
     * @param event
     */
    	const onStateChangeYoutubePlayer = event => {
    		if (event.detail.data === 1) {
    			ytPlayer.pauseVideo();
    			const data = ytPlayer.getVideoData();
    			const durationSec = Math.ceil(ytPlayer.getDuration());

    			$PLAYLIST.queue.push({
    				type: "youtube",
    				songId: ytSearchID,
    				title: data.title,
    				artist: data.author,
    				duration: getDurationNumToStr(durationSec)
    			});

    			savePlayList();
    			FLAG_LOADING_SCREEN_SAVER.set(false);
    			LOADING_SCREEN_SAVER_MSG.set("");
    			FLAG_YT_SEARCH_POPUP.set(false);
    			successToast("플레이리스트에 추가되었습니다.");
    			ytPlayer = null;
    			$$invalidate(1, ytSearchID = "");
    		} else if (event.detail.data === 5) {
    			ytPlayer.mute();
    			ytPlayer.playVideo();
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<YTSearch> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		ytURL = this.value;
    		$$invalidate(0, ytURL);
    	}

    	$$self.$capture_state = () => ({
    		YouTube: Src,
    		errorToast,
    		successToast,
    		FLAG_LOADING_SCREEN_SAVER,
    		FLAG_YT_SEARCH_POPUP,
    		LOADING_SCREEN_SAVER_MSG,
    		PLAYLIST,
    		savePlayList,
    		getDurationNumToStr,
    		Popup,
    		ytURL,
    		ytSearchID,
    		ytPlayer,
    		onClickAddBtn,
    		onReadyYoutubePlayer,
    		onStateChangeYoutubePlayer,
    		$PLAYLIST
    	});

    	$$self.$inject_state = $$props => {
    		if ('ytURL' in $$props) $$invalidate(0, ytURL = $$props.ytURL);
    		if ('ytSearchID' in $$props) $$invalidate(1, ytSearchID = $$props.ytSearchID);
    		if ('ytPlayer' in $$props) ytPlayer = $$props.ytPlayer;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		ytURL,
    		ytSearchID,
    		onClickAddBtn,
    		onReadyYoutubePlayer,
    		onStateChangeYoutubePlayer,
    		input_input_handler
    	];
    }

    class YTSearch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "YTSearch",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/PlayerApp/YTPlayer.svelte generated by Svelte v3.48.0 */

    function create_fragment$3(ctx) {
    	let youtube;
    	let current;

    	youtube = new Src({
    			props: { videoId: /*$YT_VIDEO_ID*/ ctx[0] },
    			$$inline: true
    		});

    	youtube.$on("ready", /*onReadyYoutubePlayer*/ ctx[1]);
    	youtube.$on("stateChange", /*onStateChangeYoutubePlayer*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(youtube.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(youtube, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const youtube_changes = {};
    			if (dirty & /*$YT_VIDEO_ID*/ 1) youtube_changes.videoId = /*$YT_VIDEO_ID*/ ctx[0];
    			youtube.$set(youtube_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(youtube.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(youtube.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(youtube, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $PLAYLIST;
    	let $PLAYER_ELEMENT;
    	let $FLAG_PLAYING;
    	let $PLAYER_VOLUME;
    	let $FLAG_PLAYER_IS_RUNNING;
    	let $FLAG_PLAYER_IS_BUFFERING;
    	let $FLAG_ON_CHANGE_CURRENT_TIME;
    	let $FLAG_ON_CHANGE_VOLUME;
    	let $YT_VIDEO_ID;
    	validate_store(PLAYLIST, 'PLAYLIST');
    	component_subscribe($$self, PLAYLIST, $$value => $$invalidate(3, $PLAYLIST = $$value));
    	validate_store(PLAYER_ELEMENT, 'PLAYER_ELEMENT');
    	component_subscribe($$self, PLAYER_ELEMENT, $$value => $$invalidate(4, $PLAYER_ELEMENT = $$value));
    	validate_store(FLAG_PLAYING, 'FLAG_PLAYING');
    	component_subscribe($$self, FLAG_PLAYING, $$value => $$invalidate(5, $FLAG_PLAYING = $$value));
    	validate_store(PLAYER_VOLUME, 'PLAYER_VOLUME');
    	component_subscribe($$self, PLAYER_VOLUME, $$value => $$invalidate(6, $PLAYER_VOLUME = $$value));
    	validate_store(FLAG_PLAYER_IS_RUNNING, 'FLAG_PLAYER_IS_RUNNING');
    	component_subscribe($$self, FLAG_PLAYER_IS_RUNNING, $$value => $$invalidate(7, $FLAG_PLAYER_IS_RUNNING = $$value));
    	validate_store(FLAG_PLAYER_IS_BUFFERING, 'FLAG_PLAYER_IS_BUFFERING');
    	component_subscribe($$self, FLAG_PLAYER_IS_BUFFERING, $$value => $$invalidate(8, $FLAG_PLAYER_IS_BUFFERING = $$value));
    	validate_store(FLAG_ON_CHANGE_CURRENT_TIME, 'FLAG_ON_CHANGE_CURRENT_TIME');
    	component_subscribe($$self, FLAG_ON_CHANGE_CURRENT_TIME, $$value => $$invalidate(9, $FLAG_ON_CHANGE_CURRENT_TIME = $$value));
    	validate_store(FLAG_ON_CHANGE_VOLUME, 'FLAG_ON_CHANGE_VOLUME');
    	component_subscribe($$self, FLAG_ON_CHANGE_VOLUME, $$value => $$invalidate(10, $FLAG_ON_CHANGE_VOLUME = $$value));
    	validate_store(YT_VIDEO_ID, 'YT_VIDEO_ID');
    	component_subscribe($$self, YT_VIDEO_ID, $$value => $$invalidate(0, $YT_VIDEO_ID = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('YTPlayer', slots, []);

    	setInterval(
    		() => {
    			if ($FLAG_PLAYING && !$FLAG_ON_CHANGE_VOLUME && !$FLAG_PLAYER_IS_BUFFERING && $FLAG_PLAYER_IS_RUNNING && $PLAYER_ELEMENT.getVolume) {
    				const volume = $PLAYER_ELEMENT.getVolume();

    				if (typeof volume === "number") {
    					PLAYER_VOLUME.set(volume);
    				}
    			}

    			if ($FLAG_PLAYING && !$FLAG_ON_CHANGE_CURRENT_TIME && !$FLAG_PLAYER_IS_BUFFERING && $FLAG_PLAYER_IS_RUNNING && $PLAYER_ELEMENT.getCurrentTime) {
    				PLAYER_CURRENT_TIME.set($PLAYER_ELEMENT.getCurrentTime());
    			}
    		},
    		1
    	);

    	/**
     * YouTube iframe의 Event handler를 얻는 함수
     * @param event
     */
    	const onReadyYoutubePlayer = event => {
    		PLAYER_ELEMENT.set(event.detail.target);
    	};

    	/**
     * YouTube iframe의 상태변화 Event handler
     * @param event
     */
    	const onStateChangeYoutubePlayer = event => {
    		var _a, _b;

    		if (event.detail.data === -1) {
    			// not started
    			PLAYER_DURATION.set("00:00");

    			FLAG_PLAYER_IS_BUFFERING.set(false);
    		} else if (event.detail.data === 0) {
    			// end video
    			fowardSong($FLAG_PLAYING);

    			FLAG_PLAYER_IS_READY.set(false);
    			PLAYER_DURATION.set("00:00");
    			FLAG_PLAYER_IS_BUFFERING.set(false);
    			FLAG_PLAYER_IS_RUNNING.set(false);
    		} else if (event.detail.data === 1) {
    			// is playing
    			$PLAYER_ELEMENT.setVolume($PLAYER_VOLUME);

    			FLAG_PLAYING.set(true);
    			FLAG_PLAYER_IS_READY.set(true);
    			FLAG_PLAYER_IS_BUFFERING.set(false);

    			const duration = (_a = $PLAYLIST.currentSong) === null || _a === void 0
    			? void 0
    			: _a.duration;

    			if (duration) PLAYER_DURATION.set(duration);

    			setTimeout(
    				() => {
    					FLAG_PLAYER_IS_RUNNING.set(true);
    				},
    				2000
    			);
    		} else if (event.detail.data === 2) {
    			// paused
    			FLAG_PLAYING.set(false);
    		} else if (event.detail.data === 3) {
    			// buffering
    			FLAG_PLAYER_IS_BUFFERING.set(true);
    		} else if (event.detail.data === 5) {
    			// video on ready
    			if ($FLAG_PLAYING) {
    				$PLAYER_ELEMENT.playVideo();
    			}

    			const duration = (_b = $PLAYLIST.currentSong) === null || _b === void 0
    			? void 0
    			: _b.duration;

    			if (duration) PLAYER_DURATION.set(duration);
    			FLAG_PLAYER_IS_READY.set(true);
    			FLAG_NEXT_SONG_LOADING.set(false);
    			FLAG_PLAYER_IS_BUFFERING.set(false);
    			FLAG_PLAYER_IS_RUNNING.set(false);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<YTPlayer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		YouTube: Src,
    		FLAG_PLAYER_IS_READY,
    		FLAG_PLAYING,
    		FLAG_NEXT_SONG_LOADING,
    		FLAG_ON_CHANGE_CURRENT_TIME,
    		FLAG_ON_CHANGE_VOLUME,
    		YT_VIDEO_ID,
    		PLAYER_ELEMENT,
    		PLAYER_VOLUME,
    		PLAYER_DURATION,
    		PLAYER_CURRENT_TIME,
    		PLAYLIST,
    		FLAG_PLAYER_IS_BUFFERING,
    		FLAG_PLAYER_IS_RUNNING,
    		fowardSong,
    		onReadyYoutubePlayer,
    		onStateChangeYoutubePlayer,
    		$PLAYLIST,
    		$PLAYER_ELEMENT,
    		$FLAG_PLAYING,
    		$PLAYER_VOLUME,
    		$FLAG_PLAYER_IS_RUNNING,
    		$FLAG_PLAYER_IS_BUFFERING,
    		$FLAG_ON_CHANGE_CURRENT_TIME,
    		$FLAG_ON_CHANGE_VOLUME,
    		$YT_VIDEO_ID
    	});

    	return [$YT_VIDEO_ID, onReadyYoutubePlayer, onStateChangeYoutubePlayer];
    }

    class YTPlayer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "YTPlayer",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    var jsmediatags_min = createCommonjsModule(function (module, exports) {
    var $jscomp = $jscomp || {};
    $jscomp.scope = {};
    $jscomp.ASSUME_ES5 = !1;
    $jscomp.ASSUME_NO_NATIVE_MAP = !1;
    $jscomp.ASSUME_NO_NATIVE_SET = !1;
    $jscomp.defineProperty =
      $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties
        ? Object.defineProperty
        : function (d, r, q) {
            d != Array.prototype && d != Object.prototype && (d[r] = q.value);
          };
    $jscomp.getGlobal = function (d) {
      return "undefined" != typeof window && window === d
        ? d
        : "undefined" != typeof commonjsGlobal && null != commonjsGlobal
        ? commonjsGlobal
        : d;
    };
    $jscomp.global = $jscomp.getGlobal(commonjsGlobal);
    $jscomp.polyfill = function (d, r, q, n) {
      if (r) {
        q = $jscomp.global;
        d = d.split(".");
        for (n = 0; n < d.length - 1; n++) {
          var u = d[n];
          u in q || (q[u] = {});
          q = q[u];
        }
        d = d[d.length - 1];
        n = q[d];
        r = r(n);
        r != n &&
          null != r &&
          $jscomp.defineProperty(q, d, {
            configurable: !0,
            writable: !0,
            value: r,
          });
      }
    };
    $jscomp.polyfill(
      "Object.setPrototypeOf",
      function (d) {
        return d
          ? d
          : "object" != typeof "".__proto__
          ? null
          : function (d, q) {
              d.__proto__ = q;
              if (d.__proto__ !== q) throw new TypeError(d + " is not extensible");
              return d;
            };
      },
      "es6",
      "es5"
    );
    $jscomp.objectCreate =
      $jscomp.ASSUME_ES5 || "function" == typeof Object.create
        ? Object.create
        : function (d) {
            var r = function () {};
            r.prototype = d;
            return new r();
          };
    $jscomp.construct =
      ("undefined" != typeof Reflect && Reflect.construct) ||
      function (d, r, q) {
        void 0 === q && (q = d);
        q = $jscomp.objectCreate(q.prototype || Object.prototype);
        return Function.prototype.apply.call(d, q, r) || q;
      };
    $jscomp.polyfill(
      "Reflect.construct",
      function (d) {
        return d || $jscomp.construct;
      },
      "es6",
      "es3"
    );
    (function (d) {
      (module.exports = d())
        ;
    })(function () {
      return (function () {
        function d(r, q, n) {
          function u(e, b) {
            if (!q[e]) {
              if (!r[e]) {
                var h = "function" == typeof commonjsRequire && commonjsRequire;
                if (!b && h) return h(e, !0);
                if (v) return v(e, !0);
                b = Error("Cannot find module '" + e + "'");
                throw ((b.code = "MODULE_NOT_FOUND"), b);
              }
              b = q[e] = { exports: {} };
              r[e][0].call(
                b.exports,
                function (b) {
                  return u(r[e][1][b] || b);
                },
                b,
                b.exports,
                d,
                r,
                q,
                n
              );
            }
            return q[e].exports;
          }
          for (
            var v = "function" == typeof commonjsRequire && commonjsRequire, p = 0;
            p < n.length;
            p++
          )
            u(n[p]);
          return u;
        }
        return d;
      })()(
        {
          1: [function (d, r, q) {}, {}],
          2: [
            function (d, r, q) {
              r.exports = XMLHttpRequest;
            },
            {},
          ],
          3: [
            function (d, r, q) {
              function n(f) {
                "@babel/helpers - typeof";
                n =
                  "function" === typeof Symbol &&
                  "symbol" === typeof Symbol.iterator
                    ? function (a) {
                        return typeof a;
                      }
                    : function (a) {
                        return a &&
                          "function" === typeof Symbol &&
                          a.constructor === Symbol &&
                          a !== Symbol.prototype
                          ? "symbol"
                          : typeof a;
                      };
                return n(f);
              }
              function u(f, a) {
                for (var c = 0; c < a.length; c++) {
                  var k = a[c];
                  k.enumerable = k.enumerable || !1;
                  k.configurable = !0;
                  "value" in k && (k.writable = !0);
                  Object.defineProperty(f, k.key, k);
                }
              }
              function v(f, a, c) {
                a && u(f.prototype, a);
                c && u(f, c);
                return f;
              }
              function p(f, a) {
                if ("function" !== typeof a && null !== a)
                  throw new TypeError(
                    "Super expression must either be null or a function"
                  );
                f.prototype = Object.create(a && a.prototype, {
                  constructor: { value: f, writable: !0, configurable: !0 },
                });
                a && e(f, a);
              }
              function e(f, a) {
                e =
                  Object.setPrototypeOf ||
                  function (a, k) {
                    a.__proto__ = k;
                    return a;
                  };
                return e(f, a);
              }
              function b(f) {
                var a = l();
                return function () {
                  var c = t(f);
                  if (a) {
                    var k = t(this).constructor;
                    c = Reflect.construct(c, arguments, k);
                  } else c = c.apply(this, arguments);
                  c =
                    !c || ("object" !== n(c) && "function" !== typeof c)
                      ? h(this)
                      : c;
                  return c;
                };
              }
              function h(f) {
                if (void 0 === f)
                  throw new ReferenceError(
                    "this hasn't been initialised - super() hasn't been called"
                  );
                return f;
              }
              function l() {
                if (
                  "undefined" === typeof Reflect ||
                  !Reflect.construct ||
                  Reflect.construct.sham
                )
                  return !1;
                if ("function" === typeof Proxy) return !0;
                try {
                  return (
                    Boolean.prototype.valueOf.call(
                      Reflect.construct(Boolean, [], function () {})
                    ),
                    !0
                  );
                } catch (f) {
                  return !1;
                }
              }
              function t(f) {
                t = Object.setPrototypeOf
                  ? Object.getPrototypeOf
                  : function (a) {
                      return a.__proto__ || Object.getPrototypeOf(a);
                    };
                return t(f);
              }
              function m(f, a, c) {
                a in f
                  ? Object.defineProperty(f, a, {
                      value: c,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (f[a] = c);
                return f;
              }
              d = (function (f) {
                function a(k) {
                  if (!(this instanceof a))
                    throw new TypeError("Cannot call a class as a function");
                  var g = c.call(this);
                  m(h(g), "_array", void 0);
                  m(h(g), "_size", void 0);
                  g._array = k;
                  g._size = k.length;
                  g._isInitialized = !0;
                  return g;
                }
                p(a, f);
                var c = b(a);
                v(
                  a,
                  [
                    {
                      key: "init",
                      value: function (a) {
                        setTimeout(a.onSuccess, 0);
                      },
                    },
                    {
                      key: "loadRange",
                      value: function (a, g) {
                        setTimeout(g.onSuccess, 0);
                      },
                    },
                    {
                      key: "getByteAt",
                      value: function (a) {
                        if (a >= this._array.length)
                          throw Error("Offset " + a + " hasn't been loaded yet.");
                        return this._array[a];
                      },
                    },
                  ],
                  [
                    {
                      key: "canReadFile",
                      value: function (a) {
                        return (
                          Array.isArray(a) ||
                          ("function" === typeof Buffer && Buffer.isBuffer(a))
                        );
                      },
                    },
                  ]
                );
                return a;
              })(d("./MediaFileReader"));
              r.exports = d;
            },
            { "./MediaFileReader": 11 },
          ],
          4: [
            function (d, r, q) {
              function n(a) {
                "@babel/helpers - typeof";
                n =
                  "function" === typeof Symbol &&
                  "symbol" === typeof Symbol.iterator
                    ? function (a) {
                        return typeof a;
                      }
                    : function (a) {
                        return a &&
                          "function" === typeof Symbol &&
                          a.constructor === Symbol &&
                          a !== Symbol.prototype
                          ? "symbol"
                          : typeof a;
                      };
                return n(a);
              }
              function u(a, c) {
                for (var k = 0; k < c.length; k++) {
                  var g = c[k];
                  g.enumerable = g.enumerable || !1;
                  g.configurable = !0;
                  "value" in g && (g.writable = !0);
                  Object.defineProperty(a, g.key, g);
                }
              }
              function v(a, c, k) {
                c && u(a.prototype, c);
                k && u(a, k);
                return a;
              }
              function p(a, c) {
                if ("function" !== typeof c && null !== c)
                  throw new TypeError(
                    "Super expression must either be null or a function"
                  );
                a.prototype = Object.create(c && c.prototype, {
                  constructor: { value: a, writable: !0, configurable: !0 },
                });
                c && e(a, c);
              }
              function e(a, c) {
                e =
                  Object.setPrototypeOf ||
                  function (a, g) {
                    a.__proto__ = g;
                    return a;
                  };
                return e(a, c);
              }
              function b(a) {
                var c = l();
                return function () {
                  var k = t(a);
                  if (c) {
                    var g = t(this).constructor;
                    k = Reflect.construct(k, arguments, g);
                  } else k = k.apply(this, arguments);
                  k =
                    !k || ("object" !== n(k) && "function" !== typeof k)
                      ? h(this)
                      : k;
                  return k;
                };
              }
              function h(a) {
                if (void 0 === a)
                  throw new ReferenceError(
                    "this hasn't been initialised - super() hasn't been called"
                  );
                return a;
              }
              function l() {
                if (
                  "undefined" === typeof Reflect ||
                  !Reflect.construct ||
                  Reflect.construct.sham
                )
                  return !1;
                if ("function" === typeof Proxy) return !0;
                try {
                  return (
                    Boolean.prototype.valueOf.call(
                      Reflect.construct(Boolean, [], function () {})
                    ),
                    !0
                  );
                } catch (a) {
                  return !1;
                }
              }
              function t(a) {
                t = Object.setPrototypeOf
                  ? Object.getPrototypeOf
                  : function (a) {
                      return a.__proto__ || Object.getPrototypeOf(a);
                    };
                return t(a);
              }
              function m(a, c, k) {
                c in a
                  ? Object.defineProperty(a, c, {
                      value: k,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (a[c] = k);
                return a;
              }
              var f = d("./ChunkedFileData");
              d = (function (a) {
                function c(a) {
                  if (!(this instanceof c))
                    throw new TypeError("Cannot call a class as a function");
                  var g = k.call(this);
                  m(h(g), "_blob", void 0);
                  m(h(g), "_fileData", void 0);
                  g._blob = a;
                  g._fileData = new f();
                  return g;
                }
                p(c, a);
                var k = b(c);
                v(
                  c,
                  [
                    {
                      key: "_init",
                      value: function (a) {
                        this._size = this._blob.size;
                        setTimeout(a.onSuccess, 1);
                      },
                    },
                    {
                      key: "loadRange",
                      value: function (a, c) {
                        var g = this,
                          k = (
                            this._blob.slice ||
                            this._blob.mozSlice ||
                            this._blob.webkitSlice
                          ).call(this._blob, a[0], a[1] + 1),
                          f = new FileReader();
                        f.onloadend = function (k) {
                          k = new Uint8Array(f.result);
                          g._fileData.addData(a[0], k);
                          c.onSuccess();
                        };
                        f.onerror = f.onabort = function (a) {
                          if (c.onError) c.onError({ type: "blob", info: f.error });
                        };
                        f.readAsArrayBuffer(k);
                      },
                    },
                    {
                      key: "getByteAt",
                      value: function (a) {
                        return this._fileData.getByteAt(a);
                      },
                    },
                  ],
                  [
                    {
                      key: "canReadFile",
                      value: function (a) {
                        return (
                          ("undefined" !== typeof Blob && a instanceof Blob) ||
                          ("undefined" !== typeof File && a instanceof File)
                        );
                      },
                    },
                  ]
                );
                return c;
              })(d("./MediaFileReader"));
              r.exports = d;
            },
            { "./ChunkedFileData": 5, "./MediaFileReader": 11 },
          ],
          5: [
            function (d, r, q) {
              function n(d, p) {
                for (var e = 0; e < p.length; e++) {
                  var b = p[e];
                  b.enumerable = b.enumerable || !1;
                  b.configurable = !0;
                  "value" in b && (b.writable = !0);
                  Object.defineProperty(d, b.key, b);
                }
              }
              function u(d, p, e) {
                p && n(d.prototype, p);
                e && n(d, e);
                return d;
              }
              d = (function () {
                function d() {
                  if (!(this instanceof d))
                    throw new TypeError("Cannot call a class as a function");
                  "_fileData" in this
                    ? Object.defineProperty(this, "_fileData", {
                        value: void 0,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                      })
                    : (this._fileData = void 0);
                  this._fileData = [];
                }
                u(
                  d,
                  [
                    {
                      key: "addData",
                      value: function (d, e) {
                        var b = d + e.length - 1,
                          h = this._getChunkRange(d, b);
                        if (-1 === h.startIx)
                          this._fileData.splice(h.insertIx || 0, 0, {
                            offset: d,
                            data: e,
                          });
                        else {
                          var l = this._fileData[h.startIx],
                            p = this._fileData[h.endIx];
                          b = b < p.offset + p.data.length - 1;
                          var m = { offset: Math.min(d, l.offset), data: e };
                          d > l.offset &&
                            ((d = this._sliceData(l.data, 0, d - l.offset)),
                            (m.data = this._concatData(d, e)));
                          b &&
                            ((d = this._sliceData(m.data, 0, p.offset - m.offset)),
                            (m.data = this._concatData(d, p.data)));
                          this._fileData.splice(
                            h.startIx,
                            h.endIx - h.startIx + 1,
                            m
                          );
                        }
                      },
                    },
                    {
                      key: "_concatData",
                      value: function (d, e) {
                        if (
                          "undefined" !== typeof ArrayBuffer &&
                          ArrayBuffer.isView &&
                          ArrayBuffer.isView(d)
                        ) {
                          var b = new d.constructor(d.length + e.length);
                          b.set(d, 0);
                          b.set(e, d.length);
                          return b;
                        }
                        return d.concat(e);
                      },
                    },
                    {
                      key: "_sliceData",
                      value: function (d, e, b) {
                        return d.slice ? d.slice(e, b) : d.subarray(e, b);
                      },
                    },
                    {
                      key: "_getChunkRange",
                      value: function (d, e) {
                        for (
                          var b, h, l = -1, t = -1, m = 0, f = 0;
                          f < this._fileData.length;
                          f++, m = f
                        ) {
                          h = this._fileData[f].offset;
                          b = h + this._fileData[f].data.length;
                          if (e < h - 1) break;
                          if (d <= b + 1 && e >= h - 1) {
                            l = f;
                            break;
                          }
                        }
                        if (-1 === l)
                          return { startIx: -1, endIx: -1, insertIx: m };
                        for (
                          f = l;
                          f < this._fileData.length &&
                          !((h = this._fileData[f].offset),
                          (b = h + this._fileData[f].data.length),
                          e >= h - 1 && (t = f),
                          e <= b + 1);
                          f++
                        );
                        -1 === t && (t = l);
                        return { startIx: l, endIx: t };
                      },
                    },
                    {
                      key: "hasDataRange",
                      value: function (d, e) {
                        for (var b = 0; b < this._fileData.length; b++) {
                          var h = this._fileData[b];
                          if (e < h.offset) break;
                          if (d >= h.offset && e < h.offset + h.data.length)
                            return !0;
                        }
                        return !1;
                      },
                    },
                    {
                      key: "getByteAt",
                      value: function (d) {
                        for (var e, b = 0; b < this._fileData.length; b++) {
                          var h = this._fileData[b].offset,
                            l = h + this._fileData[b].data.length - 1;
                          if (d >= h && d <= l) {
                            e = this._fileData[b];
                            break;
                          }
                        }
                        if (e) return e.data[d - e.offset];
                        throw Error("Offset " + d + " hasn't been loaded yet.");
                      },
                    },
                  ],
                  [
                    {
                      key: "NOT_FOUND",
                      get: function () {
                        return -1;
                      },
                    },
                  ]
                );
                return d;
              })();
              r.exports = d;
            },
            {},
          ],
          6: [
            function (d, r, q) {
              function n(a) {
                "@babel/helpers - typeof";
                n =
                  "function" === typeof Symbol &&
                  "symbol" === typeof Symbol.iterator
                    ? function (a) {
                        return typeof a;
                      }
                    : function (a) {
                        return a &&
                          "function" === typeof Symbol &&
                          a.constructor === Symbol &&
                          a !== Symbol.prototype
                          ? "symbol"
                          : typeof a;
                      };
                return n(a);
              }
              function u(a, g) {
                for (var c = 0; c < g.length; c++) {
                  var k = g[c];
                  k.enumerable = k.enumerable || !1;
                  k.configurable = !0;
                  "value" in k && (k.writable = !0);
                  Object.defineProperty(a, k.key, k);
                }
              }
              function v(a, g, c) {
                g && u(a.prototype, g);
                c && u(a, c);
                return a;
              }
              function p(a, c) {
                if ("function" !== typeof c && null !== c)
                  throw new TypeError(
                    "Super expression must either be null or a function"
                  );
                a.prototype = Object.create(c && c.prototype, {
                  constructor: { value: a, writable: !0, configurable: !0 },
                });
                c && e(a, c);
              }
              function e(a, c) {
                e =
                  Object.setPrototypeOf ||
                  function (a, c) {
                    a.__proto__ = c;
                    return a;
                  };
                return e(a, c);
              }
              function b(a) {
                var c = l();
                return function () {
                  var g = t(a);
                  if (c) {
                    var k = t(this).constructor;
                    g = Reflect.construct(g, arguments, k);
                  } else g = g.apply(this, arguments);
                  g =
                    !g || ("object" !== n(g) && "function" !== typeof g)
                      ? h(this)
                      : g;
                  return g;
                };
              }
              function h(a) {
                if (void 0 === a)
                  throw new ReferenceError(
                    "this hasn't been initialised - super() hasn't been called"
                  );
                return a;
              }
              function l() {
                if (
                  "undefined" === typeof Reflect ||
                  !Reflect.construct ||
                  Reflect.construct.sham
                )
                  return !1;
                if ("function" === typeof Proxy) return !0;
                try {
                  return (
                    Boolean.prototype.valueOf.call(
                      Reflect.construct(Boolean, [], function () {})
                    ),
                    !0
                  );
                } catch (k) {
                  return !1;
                }
              }
              function t(a) {
                t = Object.setPrototypeOf
                  ? Object.getPrototypeOf
                  : function (a) {
                      return a.__proto__ || Object.getPrototypeOf(a);
                    };
                return t(a);
              }
              function m(a, c, f) {
                c in a
                  ? Object.defineProperty(a, c, {
                      value: f,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (a[c] = f);
                return a;
              }
              var f = [4, 132],
                a = [6, 134],
                c =
                  "Other;32x32 pixels 'file icon' (PNG only);Other file icon;Cover (front);Cover (back);Leaflet page;Media (e.g. label side of CD);Lead artist/lead performer/soloist;Artist/performer;Conductor;Band/Orchestra;Composer;Lyricist/text writer;Recording Location;During recording;During performance;Movie/video screen capture;A bright coloured fish;Illustration;Band/artist logotype;Publisher/Studio logotype".split(
                    ";"
                  );
              d = (function (k) {
                function g() {
                  if (!(this instanceof g))
                    throw new TypeError("Cannot call a class as a function");
                  var a = arguments.length;
                  for (var c = Array(a), f = 0; f < a; f++) c[f] = arguments[f];
                  a = w.call.apply(w, [this].concat(c));
                  m(h(a), "_commentOffset", void 0);
                  m(h(a), "_pictureOffset", void 0);
                  return a;
                }
                p(g, k);
                var w = b(g);
                v(
                  g,
                  [
                    {
                      key: "_loadData",
                      value: function (a, c) {
                        var g = this;
                        a.loadRange([4, 7], {
                          onSuccess: function () {
                            g._loadBlock(a, 4, c);
                          },
                        });
                      },
                    },
                    {
                      key: "_loadBlock",
                      value: function (c, g, k) {
                        var b = this,
                          m = c.getByteAt(g),
                          w = c.getInteger24At(g + 1, !0);
                        if (-1 !== f.indexOf(m)) {
                          var e = g + 4;
                          c.loadRange([e, e + w], {
                            onSuccess: function () {
                              b._commentOffset = e;
                              b._nextBlock(c, g, m, w, k);
                            },
                          });
                        } else
                          -1 !== a.indexOf(m)
                            ? ((e = g + 4),
                              c.loadRange([e, e + w], {
                                onSuccess: function () {
                                  b._pictureOffset = e;
                                  b._nextBlock(c, g, m, w, k);
                                },
                              }))
                            : b._nextBlock(c, g, m, w, k);
                      },
                    },
                    {
                      key: "_nextBlock",
                      value: function (a, c, g, f, k) {
                        var b = this;
                        if (127 < g)
                          if (b._commentOffset) k.onSuccess();
                          else
                            k.onError({
                              type: "loadData",
                              info: "Comment block could not be found.",
                            });
                        else
                          a.loadRange([c + 4 + f, c + 4 + 4 + f], {
                            onSuccess: function () {
                              b._loadBlock(a, c + 4 + f, k);
                            },
                          });
                      },
                    },
                    {
                      key: "_parseData",
                      value: function (a, g) {
                        var f =
                          a.getLongAt(this._commentOffset, !1) +
                          (this._commentOffset + 4);
                        g = a.getLongAt(f, !1);
                        f += 4;
                        for (var k, b, m, w, e, d, h = 0; h < g; h++) {
                          var x = a.getLongAt(f, !1),
                            l = a
                              .getStringWithCharsetAt(f + 4, x, "utf-8")
                              .toString(),
                            y = l.indexOf("=");
                          l = [l.slice(0, y), l.slice(y + 1)];
                          switch (l[0].toUpperCase()) {
                            case "TITLE":
                              k = l[1];
                              break;
                            case "ARTIST":
                              b = l[1];
                              break;
                            case "ALBUM":
                              m = l[1];
                              break;
                            case "TRACKNUMBER":
                              w = l[1];
                              break;
                            case "GENRE":
                              e = l[1];
                          }
                          f += 4 + x;
                        }
                        this._pictureOffset &&
                          ((d = a.getLongAt(this._pictureOffset, !0)),
                          (g = this._pictureOffset + 4),
                          (f = a.getLongAt(g, !0)),
                          (h = g + 4),
                          (g = a.getStringAt(h, f)),
                          (f = h + f),
                          (h = a.getLongAt(f, !0)),
                          (x = f + 4),
                          (f = a.getStringWithCharsetAt(x, h, "utf-8").toString()),
                          (h = x + h + 16),
                          (x = a.getLongAt(h, !0)),
                          (a = a.getBytesAt(h + 4, x, !0)),
                          (d = { format: g, type: c[d], description: f, data: a }));
                        return {
                          type: "FLAC",
                          version: "1",
                          tags: {
                            title: k,
                            artist: b,
                            album: m,
                            track: w,
                            genre: e,
                            picture: d,
                          },
                        };
                      },
                    },
                  ],
                  [
                    {
                      key: "getTagIdentifierByteRange",
                      value: function () {
                        return { offset: 0, length: 4 };
                      },
                    },
                    {
                      key: "canReadTagFormat",
                      value: function (a) {
                        return (
                          "fLaC" ===
                          String.fromCharCode.apply(String, a.slice(0, 4))
                        );
                      },
                    },
                  ]
                );
                return g;
              })(d("./MediaTagReader"));
              r.exports = d;
            },
            { "./MediaTagReader": 12 },
          ],
          7: [
            function (d, r, q) {
              function n(b) {
                "@babel/helpers - typeof";
                n =
                  "function" === typeof Symbol &&
                  "symbol" === typeof Symbol.iterator
                    ? function (f) {
                        return typeof f;
                      }
                    : function (f) {
                        return f &&
                          "function" === typeof Symbol &&
                          f.constructor === Symbol &&
                          f !== Symbol.prototype
                          ? "symbol"
                          : typeof f;
                      };
                return n(b);
              }
              function u(b, f) {
                for (var a = 0; a < f.length; a++) {
                  var c = f[a];
                  c.enumerable = c.enumerable || !1;
                  c.configurable = !0;
                  "value" in c && (c.writable = !0);
                  Object.defineProperty(b, c.key, c);
                }
              }
              function v(b, f, a) {
                f && u(b.prototype, f);
                a && u(b, a);
                return b;
              }
              function p(b, f) {
                if ("function" !== typeof f && null !== f)
                  throw new TypeError(
                    "Super expression must either be null or a function"
                  );
                b.prototype = Object.create(f && f.prototype, {
                  constructor: { value: b, writable: !0, configurable: !0 },
                });
                f && e(b, f);
              }
              function e(b, f) {
                e =
                  Object.setPrototypeOf ||
                  function (a, c) {
                    a.__proto__ = c;
                    return a;
                  };
                return e(b, f);
              }
              function b(b) {
                var f = h();
                return function () {
                  var a = l(b);
                  if (f) {
                    var c = l(this).constructor;
                    a = Reflect.construct(a, arguments, c);
                  } else a = a.apply(this, arguments);
                  if (!a || ("object" !== n(a) && "function" !== typeof a)) {
                    if (void 0 === this)
                      throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                      );
                    a = this;
                  }
                  return a;
                };
              }
              function h() {
                if (
                  "undefined" === typeof Reflect ||
                  !Reflect.construct ||
                  Reflect.construct.sham
                )
                  return !1;
                if ("function" === typeof Proxy) return !0;
                try {
                  return (
                    Boolean.prototype.valueOf.call(
                      Reflect.construct(Boolean, [], function () {})
                    ),
                    !0
                  );
                } catch (m) {
                  return !1;
                }
              }
              function l(b) {
                l = Object.setPrototypeOf
                  ? Object.getPrototypeOf
                  : function (f) {
                      return f.__proto__ || Object.getPrototypeOf(f);
                    };
                return l(b);
              }
              q = d("./MediaTagReader");
              d("./MediaFileReader");
              d = (function (m) {
                function f() {
                  if (!(this instanceof f))
                    throw new TypeError("Cannot call a class as a function");
                  return a.apply(this, arguments);
                }
                p(f, m);
                var a = b(f);
                v(
                  f,
                  [
                    {
                      key: "_loadData",
                      value: function (a, f) {
                        var c = a.getSize();
                        a.loadRange([c - 128, c - 1], f);
                      },
                    },
                    {
                      key: "_parseData",
                      value: function (a, f) {
                        var c = a.getSize() - 128,
                          b = a.getStringWithCharsetAt(c + 3, 30).toString(),
                          k = a.getStringWithCharsetAt(c + 33, 30).toString(),
                          m = a.getStringWithCharsetAt(c + 63, 30).toString(),
                          e = a.getStringWithCharsetAt(c + 93, 4).toString();
                        var d = a.getByteAt(c + 97 + 28);
                        f = a.getByteAt(c + 97 + 29);
                        if (0 == d && 0 != f) {
                          var h = "1.1";
                          d = a.getStringWithCharsetAt(c + 97, 28).toString();
                        } else
                          (h = "1.0"),
                            (d = a.getStringWithCharsetAt(c + 97, 30).toString()),
                            (f = 0);
                        a = a.getByteAt(c + 97 + 30);
                        a = {
                          type: "ID3",
                          version: h,
                          tags: {
                            title: b,
                            artist: k,
                            album: m,
                            year: e,
                            comment: d,
                            genre: 255 > a ? t[a] : "",
                          },
                        };
                        f && (a.tags.track = f);
                        return a;
                      },
                    },
                  ],
                  [
                    {
                      key: "getTagIdentifierByteRange",
                      value: function () {
                        return { offset: -128, length: 128 };
                      },
                    },
                    {
                      key: "canReadTagFormat",
                      value: function (a) {
                        return (
                          "TAG" === String.fromCharCode.apply(String, a.slice(0, 3))
                        );
                      },
                    },
                  ]
                );
                return f;
              })(q);
              var t =
                "Blues;Classic Rock;Country;Dance;Disco;Funk;Grunge;Hip-Hop;Jazz;Metal;New Age;Oldies;Other;Pop;R&B;Rap;Reggae;Rock;Techno;Industrial;Alternative;Ska;Death Metal;Pranks;Soundtrack;Euro-Techno;Ambient;Trip-Hop;Vocal;Jazz+Funk;Fusion;Trance;Classical;Instrumental;Acid;House;Game;Sound Clip;Gospel;Noise;AlternRock;Bass;Soul;Punk;Space;Meditative;Instrumental Pop;Instrumental Rock;Ethnic;Gothic;Darkwave;Techno-Industrial;Electronic;Pop-Folk;Eurodance;Dream;Southern Rock;Comedy;Cult;Gangsta;Top 40;Christian Rap;Pop/Funk;Jungle;Native American;Cabaret;New Wave;Psychadelic;Rave;Showtunes;Trailer;Lo-Fi;Tribal;Acid Punk;Acid Jazz;Polka;Retro;Musical;Rock & Roll;Hard Rock;Folk;Folk-Rock;National Folk;Swing;Fast Fusion;Bebob;Latin;Revival;Celtic;Bluegrass;Avantgarde;Gothic Rock;Progressive Rock;Psychedelic Rock;Symphonic Rock;Slow Rock;Big Band;Chorus;Easy Listening;Acoustic;Humour;Speech;Chanson;Opera;Chamber Music;Sonata;Symphony;Booty Bass;Primus;Porn Groove;Satire;Slow Jam;Club;Tango;Samba;Folklore;Ballad;Power Ballad;Rhythmic Soul;Freestyle;Duet;Punk Rock;Drum Solo;Acapella;Euro-House;Dance Hall".split(
                  ";"
                );
              r.exports = d;
            },
            { "./MediaFileReader": 11, "./MediaTagReader": 12 },
          ],
          8: [
            function (d, r, q) {
              function n(b, f) {
                for (var a = 0; a < f.length; a++) {
                  var c = f[a];
                  c.enumerable = c.enumerable || !1;
                  c.configurable = !0;
                  "value" in c && (c.writable = !0);
                  Object.defineProperty(b, c.key, c);
                }
              }
              function u(b, f, a) {
                f && n(b.prototype, f);
                a && n(b, a);
                return b;
              }
              function v(b) {
                switch (b) {
                  case 0:
                    b = "iso-8859-1";
                    break;
                  case 1:
                    b = "utf-16";
                    break;
                  case 2:
                    b = "utf-16be";
                    break;
                  case 3:
                    b = "utf-8";
                    break;
                  default:
                    b = "iso-8859-1";
                }
                return b;
              }
              function p(b, f, a, c) {
                var k = a.getStringWithCharsetAt(b + 1, f - 1, c);
                b = a.getStringWithCharsetAt(
                  b + 1 + k.bytesReadCount,
                  f - 1 - k.bytesReadCount,
                  c
                );
                return { user_description: k.toString(), data: b.toString() };
              }
              d("./MediaFileReader");
              var e = d("./StringUtils"),
                b = d("./ArrayFileReader"),
                h = {
                  BUF: "Recommended buffer size",
                  CNT: "Play counter",
                  COM: "Comments",
                  CRA: "Audio encryption",
                  CRM: "Encrypted meta frame",
                  ETC: "Event timing codes",
                  EQU: "Equalization",
                  GEO: "General encapsulated object",
                  IPL: "Involved people list",
                  LNK: "Linked information",
                  MCI: "Music CD Identifier",
                  MLL: "MPEG location lookup table",
                  PIC: "Attached picture",
                  POP: "Popularimeter",
                  REV: "Reverb",
                  RVA: "Relative volume adjustment",
                  SLT: "Synchronized lyric/text",
                  STC: "Synced tempo codes",
                  TAL: "Album/Movie/Show title",
                  TBP: "BPM (Beats Per Minute)",
                  TCM: "Composer",
                  TCO: "Content type",
                  TCR: "Copyright message",
                  TDA: "Date",
                  TDY: "Playlist delay",
                  TEN: "Encoded by",
                  TFT: "File type",
                  TIM: "Time",
                  TKE: "Initial key",
                  TLA: "Language(s)",
                  TLE: "Length",
                  TMT: "Media type",
                  TOA: "Original artist(s)/performer(s)",
                  TOF: "Original filename",
                  TOL: "Original Lyricist(s)/text writer(s)",
                  TOR: "Original release year",
                  TOT: "Original album/Movie/Show title",
                  TP1: "Lead artist(s)/Lead performer(s)/Soloist(s)/Performing group",
                  TP2: "Band/Orchestra/Accompaniment",
                  TP3: "Conductor/Performer refinement",
                  TP4: "Interpreted, remixed, or otherwise modified by",
                  TPA: "Part of a set",
                  TPB: "Publisher",
                  TRC: "ISRC (International Standard Recording Code)",
                  TRD: "Recording dates",
                  TRK: "Track number/Position in set",
                  TSI: "Size",
                  TSS: "Software/hardware and settings used for encoding",
                  TT1: "Content group description",
                  TT2: "Title/Songname/Content description",
                  TT3: "Subtitle/Description refinement",
                  TXT: "Lyricist/text writer",
                  TXX: "User defined text information frame",
                  TYE: "Year",
                  UFI: "Unique file identifier",
                  ULT: "Unsychronized lyric/text transcription",
                  WAF: "Official audio file webpage",
                  WAR: "Official artist/performer webpage",
                  WAS: "Official audio source webpage",
                  WCM: "Commercial information",
                  WCP: "Copyright/Legal information",
                  WPB: "Publishers official webpage",
                  WXX: "User defined URL link frame",
                  AENC: "Audio encryption",
                  APIC: "Attached picture",
                  ASPI: "Audio seek point index",
                  CHAP: "Chapter",
                  CTOC: "Table of contents",
                  COMM: "Comments",
                  COMR: "Commercial frame",
                  ENCR: "Encryption method registration",
                  EQU2: "Equalisation (2)",
                  EQUA: "Equalization",
                  ETCO: "Event timing codes",
                  GEOB: "General encapsulated object",
                  GRID: "Group identification registration",
                  IPLS: "Involved people list",
                  LINK: "Linked information",
                  MCDI: "Music CD identifier",
                  MLLT: "MPEG location lookup table",
                  OWNE: "Ownership frame",
                  PRIV: "Private frame",
                  PCNT: "Play counter",
                  POPM: "Popularimeter",
                  POSS: "Position synchronisation frame",
                  RBUF: "Recommended buffer size",
                  RVA2: "Relative volume adjustment (2)",
                  RVAD: "Relative volume adjustment",
                  RVRB: "Reverb",
                  SEEK: "Seek frame",
                  SYLT: "Synchronized lyric/text",
                  SYTC: "Synchronized tempo codes",
                  TALB: "Album/Movie/Show title",
                  TBPM: "BPM (beats per minute)",
                  TCOM: "Composer",
                  TCON: "Content type",
                  TCOP: "Copyright message",
                  TDAT: "Date",
                  TDLY: "Playlist delay",
                  TDRC: "Recording time",
                  TDRL: "Release time",
                  TDTG: "Tagging time",
                  TENC: "Encoded by",
                  TEXT: "Lyricist/Text writer",
                  TFLT: "File type",
                  TIME: "Time",
                  TIPL: "Involved people list",
                  TIT1: "Content group description",
                  TIT2: "Title/songname/content description",
                  TIT3: "Subtitle/Description refinement",
                  TKEY: "Initial key",
                  TLAN: "Language(s)",
                  TLEN: "Length",
                  TMCL: "Musician credits list",
                  TMED: "Media type",
                  TMOO: "Mood",
                  TOAL: "Original album/movie/show title",
                  TOFN: "Original filename",
                  TOLY: "Original lyricist(s)/text writer(s)",
                  TOPE: "Original artist(s)/performer(s)",
                  TORY: "Original release year",
                  TOWN: "File owner/licensee",
                  TPE1: "Lead performer(s)/Soloist(s)",
                  TPE2: "Band/orchestra/accompaniment",
                  TPE3: "Conductor/performer refinement",
                  TPE4: "Interpreted, remixed, or otherwise modified by",
                  TPOS: "Part of a set",
                  TPRO: "Produced notice",
                  TPUB: "Publisher",
                  TRCK: "Track number/Position in set",
                  TRDA: "Recording dates",
                  TRSN: "Internet radio station name",
                  TRSO: "Internet radio station owner",
                  TSOA: "Album sort order",
                  TSOP: "Performer sort order",
                  TSOT: "Title sort order",
                  TSIZ: "Size",
                  TSRC: "ISRC (international standard recording code)",
                  TSSE: "Software/Hardware and settings used for encoding",
                  TSST: "Set subtitle",
                  TYER: "Year",
                  TXXX: "User defined text information frame",
                  UFID: "Unique file identifier",
                  USER: "Terms of use",
                  USLT: "Unsychronized lyric/text transcription",
                  WCOM: "Commercial information",
                  WCOP: "Copyright/Legal information",
                  WOAF: "Official audio file webpage",
                  WOAR: "Official artist/performer webpage",
                  WOAS: "Official audio source webpage",
                  WORS: "Official internet radio station homepage",
                  WPAY: "Payment",
                  WPUB: "Publishers official webpage",
                  WXXX: "User defined URL link frame",
                };
              d = (function () {
                function e() {
                  if (!(this instanceof e))
                    throw new TypeError("Cannot call a class as a function");
                }
                u(e, null, [
                  {
                    key: "getFrameReaderFunction",
                    value: function (b) {
                      return b in l
                        ? l[b]
                        : "T" === b[0]
                        ? l["T*"]
                        : "W" === b[0]
                        ? l["W*"]
                        : null;
                    },
                  },
                  {
                    key: "readFrames",
                    value: function (b, a, c, k, g) {
                      for (
                        var f = {}, d = this._getFrameHeaderSize(k);
                        b < a - d;

                      ) {
                        var h = this._readFrameHeader(c, b, k),
                          m = h.id;
                        if (!m) break;
                        var l = h.flags,
                          t = h.size,
                          p = b + h.headerSize,
                          n = c;
                        b += h.headerSize + h.size;
                        if (!g || -1 !== g.indexOf(m)) {
                          if (
                            "MP3e" === m ||
                            "\x00MP3" === m ||
                            "\x00\x00MP" === m ||
                            " MP3" === m
                          )
                            break;
                          l &&
                            l.format.unsynchronisation &&
                            !k.flags.unsynchronisation &&
                            ((n = this.getUnsyncFileReader(n, p, t)),
                            (p = 0),
                            (t = n.getSize()));
                          l &&
                            l.format.data_length_indicator &&
                            ((p += 4), (t -= 4));
                          l = (h = e.getFrameReaderFunction(m))
                            ? h.apply(this, [p, t, n, l, k])
                            : null;
                          p = this._getFrameDescription(m);
                          t = { id: m, size: t, description: p, data: l };
                          m in f
                            ? (f[m].id && (f[m] = [f[m]]), f[m].push(t))
                            : (f[m] = t);
                        }
                      }
                      return f;
                    },
                  },
                  {
                    key: "_getFrameHeaderSize",
                    value: function (b) {
                      b = b.major;
                      return 2 == b ? 6 : 3 == b || 4 == b ? 10 : 0;
                    },
                  },
                  {
                    key: "_readFrameHeader",
                    value: function (b, a, c) {
                      var f = c.major,
                        g = null;
                      c = this._getFrameHeaderSize(c);
                      switch (f) {
                        case 2:
                          var e = b.getStringAt(a, 3);
                          var m = b.getInteger24At(a + 3, !0);
                          break;
                        case 3:
                          e = b.getStringAt(a, 4);
                          m = b.getLongAt(a + 4, !0);
                          break;
                        case 4:
                          (e = b.getStringAt(a, 4)),
                            (m = b.getSynchsafeInteger32At(a + 4));
                      }
                      if (
                        e == String.fromCharCode(0, 0, 0) ||
                        e == String.fromCharCode(0, 0, 0, 0)
                      )
                        e = "";
                      e && 2 < f && (g = this._readFrameFlags(b, a + 8));
                      return {
                        id: e || "",
                        size: m || 0,
                        headerSize: c || 0,
                        flags: g,
                      };
                    },
                  },
                  {
                    key: "_readFrameFlags",
                    value: function (b, a) {
                      return {
                        message: {
                          tag_alter_preservation: b.isBitSetAt(a, 6),
                          file_alter_preservation: b.isBitSetAt(a, 5),
                          read_only: b.isBitSetAt(a, 4),
                        },
                        format: {
                          grouping_identity: b.isBitSetAt(a + 1, 7),
                          compression: b.isBitSetAt(a + 1, 3),
                          encryption: b.isBitSetAt(a + 1, 2),
                          unsynchronisation: b.isBitSetAt(a + 1, 1),
                          data_length_indicator: b.isBitSetAt(a + 1, 0),
                        },
                      };
                    },
                  },
                  {
                    key: "_getFrameDescription",
                    value: function (b) {
                      return b in h ? h[b] : "Unknown";
                    },
                  },
                  {
                    key: "getUnsyncFileReader",
                    value: function (f, a, c) {
                      f = f.getBytesAt(a, c);
                      for (a = 0; a < f.length - 1; a++)
                        255 === f[a] && 0 === f[a + 1] && f.splice(a + 1, 1);
                      return new b(f);
                    },
                  },
                ]);
                return e;
              })();
              var l = {
                APIC: function (b, f, a, c, k) {
                  c = b;
                  var g = v(a.getByteAt(b));
                  switch (k && k.major) {
                    case 2:
                      k = a.getStringAt(b + 1, 3);
                      b += 4;
                      break;
                    case 3:
                    case 4:
                      k = a.getStringWithCharsetAt(b + 1, f - 1);
                      b += 1 + k.bytesReadCount;
                      break;
                    default:
                      throw Error("Couldn't read ID3v2 major version.");
                  }
                  var e = a.getByteAt(b);
                  e = t[e];
                  g = a.getStringWithCharsetAt(b + 1, f - (b - c) - 1, g);
                  b += 1 + g.bytesReadCount;
                  return {
                    format: k.toString(),
                    type: e,
                    description: g.toString(),
                    data: a.getBytesAt(b, c + f - b),
                  };
                },
                CHAP: function (b, f, a, c, k) {
                  c = b;
                  var g = {},
                    h = e.readNullTerminatedString(a.getBytesAt(b, f));
                  g.id = h.toString();
                  b += h.bytesReadCount;
                  g.startTime = a.getLongAt(b, !0);
                  b += 4;
                  g.endTime = a.getLongAt(b, !0);
                  b += 4;
                  g.startOffset = a.getLongAt(b, !0);
                  b += 4;
                  g.endOffset = a.getLongAt(b, !0);
                  b += 4;
                  g.subFrames = this.readFrames(b, b + (f - (b - c)), a, k);
                  return g;
                },
                CTOC: function (b, f, a, c, k) {
                  c = b;
                  var g = {
                      childElementIds: [],
                      id: void 0,
                      topLevel: void 0,
                      ordered: void 0,
                      entryCount: void 0,
                      subFrames: void 0,
                    },
                    h = e.readNullTerminatedString(a.getBytesAt(b, f));
                  g.id = h.toString();
                  b += h.bytesReadCount;
                  g.topLevel = a.isBitSetAt(b, 1);
                  g.ordered = a.isBitSetAt(b, 0);
                  b++;
                  g.entryCount = a.getByteAt(b);
                  b++;
                  for (h = 0; h < g.entryCount; h++) {
                    var d = e.readNullTerminatedString(
                      a.getBytesAt(b, f - (b - c))
                    );
                    g.childElementIds.push(d.toString());
                    b += d.bytesReadCount;
                  }
                  g.subFrames = this.readFrames(b, b + (f - (b - c)), a, k);
                  return g;
                },
                COMM: function (b, f, a, c, k) {
                  var g = b,
                    e = v(a.getByteAt(b));
                  c = a.getStringAt(b + 1, 3);
                  k = a.getStringWithCharsetAt(b + 4, f - 4, e);
                  b += 4 + k.bytesReadCount;
                  b = a.getStringWithCharsetAt(b, g + f - b, e);
                  return {
                    language: c,
                    short_description: k.toString(),
                    text: b.toString(),
                  };
                },
              };
              l.COM = l.COMM;
              l.PIC = function (b, f, a, c, k) {
                return l.APIC(b, f, a, c, k);
              };
              l.PCNT = function (b, f, a, c, k) {
                return a.getLongAt(b, !1);
              };
              l.CNT = l.PCNT;
              l["T*"] = function (b, f, a, c, k) {
                c = v(a.getByteAt(b));
                return a.getStringWithCharsetAt(b + 1, f - 1, c).toString();
              };
              l.TXXX = function (b, f, a, c, k) {
                c = v(a.getByteAt(b));
                return p(b, f, a, c);
              };
              l.WXXX = function (b, f, a, c, k) {
                if (0 === f) return null;
                c = v(a.getByteAt(b));
                return p(b, f, a, c);
              };
              l["W*"] = function (b, f, a, c, k) {
                return 0 === f
                  ? null
                  : a.getStringWithCharsetAt(b, f, "iso-8859-1").toString();
              };
              l.TCON = function (b, f, a, c) {
                return l["T*"].apply(this, arguments).replace(/^\(\d+\)/, "");
              };
              l.TCO = l.TCON;
              l.USLT = function (b, f, a, c, k) {
                var g = b,
                  e = v(a.getByteAt(b));
                c = a.getStringAt(b + 1, 3);
                k = a.getStringWithCharsetAt(b + 4, f - 4, e);
                b += 4 + k.bytesReadCount;
                b = a.getStringWithCharsetAt(b, g + f - b, e);
                return {
                  language: c,
                  descriptor: k.toString(),
                  lyrics: b.toString(),
                };
              };
              l.ULT = l.USLT;
              l.UFID = function (b, f, a, c, k) {
                c = e.readNullTerminatedString(a.getBytesAt(b, f));
                b += c.bytesReadCount;
                b = a.getBytesAt(b, f - c.bytesReadCount);
                return { ownerIdentifier: c.toString(), identifier: b };
              };
              var t =
                "Other;32x32 pixels 'file icon' (PNG only);Other file icon;Cover (front);Cover (back);Leaflet page;Media (e.g. label side of CD);Lead artist/lead performer/soloist;Artist/performer;Conductor;Band/Orchestra;Composer;Lyricist/text writer;Recording Location;During recording;During performance;Movie/video screen capture;A bright coloured fish;Illustration;Band/artist logotype;Publisher/Studio logotype".split(
                  ";"
                );
              r.exports = d;
            },
            {
              "./ArrayFileReader": 3,
              "./MediaFileReader": 11,
              "./StringUtils": 13,
            },
          ],
          9: [
            function (d, r, q) {
              function n(b) {
                "@babel/helpers - typeof";
                n =
                  "function" === typeof Symbol &&
                  "symbol" === typeof Symbol.iterator
                    ? function (a) {
                        return typeof a;
                      }
                    : function (a) {
                        return a &&
                          "function" === typeof Symbol &&
                          a.constructor === Symbol &&
                          a !== Symbol.prototype
                          ? "symbol"
                          : typeof a;
                      };
                return n(b);
              }
              function u(b, a) {
                for (var c = 0; c < a.length; c++) {
                  var f = a[c];
                  f.enumerable = f.enumerable || !1;
                  f.configurable = !0;
                  "value" in f && (f.writable = !0);
                  Object.defineProperty(b, f.key, f);
                }
              }
              function v(b, a, c) {
                a && u(b.prototype, a);
                c && u(b, c);
                return b;
              }
              function p(b, a) {
                if ("function" !== typeof a && null !== a)
                  throw new TypeError(
                    "Super expression must either be null or a function"
                  );
                b.prototype = Object.create(a && a.prototype, {
                  constructor: { value: b, writable: !0, configurable: !0 },
                });
                a && e(b, a);
              }
              function e(b, a) {
                e =
                  Object.setPrototypeOf ||
                  function (a, b) {
                    a.__proto__ = b;
                    return a;
                  };
                return e(b, a);
              }
              function b(b) {
                var a = h();
                return function () {
                  var c = l(b);
                  if (a) {
                    var f = l(this).constructor;
                    c = Reflect.construct(c, arguments, f);
                  } else c = c.apply(this, arguments);
                  if (!c || ("object" !== n(c) && "function" !== typeof c)) {
                    if (void 0 === this)
                      throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                      );
                    c = this;
                  }
                  return c;
                };
              }
              function h() {
                if (
                  "undefined" === typeof Reflect ||
                  !Reflect.construct ||
                  Reflect.construct.sham
                )
                  return !1;
                if ("function" === typeof Proxy) return !0;
                try {
                  return (
                    Boolean.prototype.valueOf.call(
                      Reflect.construct(Boolean, [], function () {})
                    ),
                    !0
                  );
                } catch (f) {
                  return !1;
                }
              }
              function l(b) {
                l = Object.setPrototypeOf
                  ? Object.getPrototypeOf
                  : function (a) {
                      return a.__proto__ || Object.getPrototypeOf(a);
                    };
                return l(b);
              }
              q = d("./MediaTagReader");
              d("./MediaFileReader");
              var t = d("./ID3v2FrameReader");
              d = (function (f) {
                function a() {
                  if (!(this instanceof a))
                    throw new TypeError("Cannot call a class as a function");
                  return c.apply(this, arguments);
                }
                p(a, f);
                var c = b(a);
                v(
                  a,
                  [
                    {
                      key: "_loadData",
                      value: function (a, b) {
                        a.loadRange([6, 9], {
                          onSuccess: function () {
                            a.loadRange(
                              [0, 10 + a.getSynchsafeInteger32At(6) - 1],
                              b
                            );
                          },
                          onError: b.onError,
                        });
                      },
                    },
                    {
                      key: "_parseData",
                      value: function (a, b) {
                        var c,
                          g = 0,
                          f = a.getByteAt(g + 3);
                        if (4 < f)
                          return { type: "ID3", version: ">2.4", tags: {} };
                        var e = a.getByteAt(g + 4),
                          k = a.isBitSetAt(g + 5, 7),
                          h = a.isBitSetAt(g + 5, 6),
                          d = a.isBitSetAt(g + 5, 5),
                          l = a.getSynchsafeInteger32At(g + 6);
                        g += 10;
                        if (h)
                          if (4 === f) {
                            var p = a.getSynchsafeInteger32At(g);
                            g += p;
                          } else (p = a.getLongAt(g, !0)), (g += p + 4);
                        p = {
                          type: "ID3",
                          version: "2." + f + "." + e,
                          major: f,
                          revision: e,
                          flags: {
                            unsynchronisation: k,
                            extended_header: h,
                            experimental_indicator: d,
                            footer_present: !1,
                          },
                          size: l,
                          tags: {},
                        };
                        b && (c = this._expandShortcutTags(b));
                        b = l + 10;
                        p.flags.unsynchronisation &&
                          ((a = t.getUnsyncFileReader(a, g, l)),
                          (g = 0),
                          (b = a.getSize()));
                        a = t.readFrames(g, b, a, p, c);
                        for (var n in m)
                          m.hasOwnProperty(n) &&
                            (c = this._getFrameData(a, m[n])) &&
                            (p.tags[n] = c);
                        for (var q in a) a.hasOwnProperty(q) && (p.tags[q] = a[q]);
                        return p;
                      },
                    },
                    {
                      key: "_getFrameData",
                      value: function (a, b) {
                        for (var c = 0, g; (g = b[c]); c++)
                          if (g in a)
                            return (
                              (a = a[g] instanceof Array ? a[g][0] : a[g]), a.data
                            );
                      },
                    },
                    {
                      key: "getShortcuts",
                      value: function () {
                        return m;
                      },
                    },
                  ],
                  [
                    {
                      key: "getTagIdentifierByteRange",
                      value: function () {
                        return { offset: 0, length: 10 };
                      },
                    },
                    {
                      key: "canReadTagFormat",
                      value: function (a) {
                        return (
                          "ID3" === String.fromCharCode.apply(String, a.slice(0, 3))
                        );
                      },
                    },
                  ]
                );
                return a;
              })(q);
              var m = {
                title: ["TIT2", "TT2"],
                artist: ["TPE1", "TP1"],
                album: ["TALB", "TAL"],
                year: ["TYER", "TYE"],
                comment: ["COMM", "COM"],
                track: ["TRCK", "TRK"],
                genre: ["TCON", "TCO"],
                picture: ["APIC", "PIC"],
                lyrics: ["USLT", "ULT"],
              };
              r.exports = d;
            },
            {
              "./ID3v2FrameReader": 8,
              "./MediaFileReader": 11,
              "./MediaTagReader": 12,
            },
          ],
          10: [
            function (d, r, q) {
              function n(a) {
                "@babel/helpers - typeof";
                n =
                  "function" === typeof Symbol &&
                  "symbol" === typeof Symbol.iterator
                    ? function (a) {
                        return typeof a;
                      }
                    : function (a) {
                        return a &&
                          "function" === typeof Symbol &&
                          a.constructor === Symbol &&
                          a !== Symbol.prototype
                          ? "symbol"
                          : typeof a;
                      };
                return n(a);
              }
              function u(a, b) {
                for (var c = 0; c < b.length; c++) {
                  var g = b[c];
                  g.enumerable = g.enumerable || !1;
                  g.configurable = !0;
                  "value" in g && (g.writable = !0);
                  Object.defineProperty(a, g.key, g);
                }
              }
              function v(a, b, f) {
                b && u(a.prototype, b);
                f && u(a, f);
                return a;
              }
              function p(a, b) {
                if ("function" !== typeof b && null !== b)
                  throw new TypeError(
                    "Super expression must either be null or a function"
                  );
                a.prototype = Object.create(b && b.prototype, {
                  constructor: { value: a, writable: !0, configurable: !0 },
                });
                b && e(a, b);
              }
              function e(a, b) {
                e =
                  Object.setPrototypeOf ||
                  function (a, b) {
                    a.__proto__ = b;
                    return a;
                  };
                return e(a, b);
              }
              function b(a) {
                var b = h();
                return function () {
                  var c = l(a);
                  if (b) {
                    var g = l(this).constructor;
                    c = Reflect.construct(c, arguments, g);
                  } else c = c.apply(this, arguments);
                  if (!c || ("object" !== n(c) && "function" !== typeof c)) {
                    if (void 0 === this)
                      throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                      );
                    c = this;
                  }
                  return c;
                };
              }
              function h() {
                if (
                  "undefined" === typeof Reflect ||
                  !Reflect.construct ||
                  Reflect.construct.sham
                )
                  return !1;
                if ("function" === typeof Proxy) return !0;
                try {
                  return (
                    Boolean.prototype.valueOf.call(
                      Reflect.construct(Boolean, [], function () {})
                    ),
                    !0
                  );
                } catch (a) {
                  return !1;
                }
              }
              function l(a) {
                l = Object.setPrototypeOf
                  ? Object.getPrototypeOf
                  : function (a) {
                      return a.__proto__ || Object.getPrototypeOf(a);
                    };
                return l(a);
              }
              q = d("./MediaTagReader");
              d("./MediaFileReader");
              d = (function (a) {
                function c() {
                  if (!(this instanceof c))
                    throw new TypeError("Cannot call a class as a function");
                  return e.apply(this, arguments);
                }
                p(c, a);
                var e = b(c);
                v(
                  c,
                  [
                    {
                      key: "_loadData",
                      value: function (a, b) {
                        var c = this;
                        a.loadRange([0, 16], {
                          onSuccess: function () {
                            c._loadAtom(a, 0, "", b);
                          },
                          onError: b.onError,
                        });
                      },
                    },
                    {
                      key: "_loadAtom",
                      value: function (a, b, c, f) {
                        if (b >= a.getSize()) f.onSuccess();
                        else {
                          var g = this,
                            e = a.getLongAt(b, !0);
                          if (0 == e || isNaN(e)) f.onSuccess();
                          else {
                            var h = a.getStringAt(b + 4, 4);
                            if (this._isContainerAtom(h)) {
                              "meta" == h && (b += 4);
                              var d = (c ? c + "." : "") + h;
                              "moov.udta.meta.ilst" === d
                                ? a.loadRange([b, b + e], f)
                                : a.loadRange([b + 8, b + 8 + 8], {
                                    onSuccess: function () {
                                      g._loadAtom(a, b + 8, d, f);
                                    },
                                    onError: f.onError,
                                  });
                            } else
                              a.loadRange([b + e, b + e + 8], {
                                onSuccess: function () {
                                  g._loadAtom(a, b + e, c, f);
                                },
                                onError: f.onError,
                              });
                          }
                        }
                      },
                    },
                    {
                      key: "_isContainerAtom",
                      value: function (a) {
                        return 0 <= ["moov", "udta", "meta", "ilst"].indexOf(a);
                      },
                    },
                    {
                      key: "_canReadAtom",
                      value: function (a) {
                        return "----" !== a;
                      },
                    },
                    {
                      key: "_parseData",
                      value: function (a, b) {
                        var c = {};
                        b = this._expandShortcutTags(b);
                        this._readAtom(c, a, 0, a.getSize(), b);
                        for (var g in f)
                          f.hasOwnProperty(g) &&
                            (b = c[f[g]]) &&
                            (c[g] = "track" === g ? b.data.track : b.data);
                        return {
                          type: "MP4",
                          ftyp: a.getStringAt(8, 4),
                          version: a.getLongAt(12, !0),
                          tags: c,
                        };
                      },
                    },
                    {
                      key: "_readAtom",
                      value: function (a, b, c, f, e, h, d) {
                        d = void 0 === d ? "" : d + "  ";
                        for (var g = c; g < c + f; ) {
                          var l = b.getLongAt(g, !0);
                          if (0 == l) break;
                          var k = b.getStringAt(g + 4, 4);
                          if (this._isContainerAtom(k)) {
                            "meta" == k && (g += 4);
                            this._readAtom(
                              a,
                              b,
                              g + 8,
                              l - 8,
                              e,
                              (h ? h + "." : "") + k,
                              d
                            );
                            break;
                          }
                          (!e || 0 <= e.indexOf(k)) &&
                            "moov.udta.meta.ilst" === h &&
                            this._canReadAtom(k) &&
                            (a[k] = this._readMetadataAtom(b, g));
                          g += l;
                        }
                      },
                    },
                    {
                      key: "_readMetadataAtom",
                      value: function (a, b) {
                        var c = a.getLongAt(b, !0),
                          g = a.getStringAt(b + 4, 4),
                          f = a.getInteger24At(b + 16 + 1, !0);
                        f = t[f];
                        if ("trkn" == g)
                          var e = {
                            track: a.getShortAt(b + 16 + 10, !0),
                            total: a.getShortAt(b + 16 + 14, !0),
                          };
                        else if ("disk" == g)
                          e = {
                            disk: a.getShortAt(b + 16 + 10, !0),
                            total: a.getShortAt(b + 16 + 14, !0),
                          };
                        else {
                          b += 24;
                          var h = c - 24;
                          "covr" === g && "uint8" === f && (f = "jpeg");
                          switch (f) {
                            case "text":
                              e = a
                                .getStringWithCharsetAt(b, h, "utf-8")
                                .toString();
                              break;
                            case "uint8":
                              e = a.getShortAt(b, !1);
                              break;
                            case "int":
                            case "uint":
                              e = (
                                "int" == f
                                  ? 1 == h
                                    ? a.getSByteAt
                                    : 2 == h
                                    ? a.getSShortAt
                                    : 4 == h
                                    ? a.getSLongAt
                                    : a.getLongAt
                                  : 1 == h
                                  ? a.getByteAt
                                  : 2 == h
                                  ? a.getShortAt
                                  : a.getLongAt
                              ).call(a, b + (8 == h ? 4 : 0), !0);
                              break;
                            case "jpeg":
                            case "png":
                              e = {
                                format: "image/" + f,
                                data: a.getBytesAt(b, h),
                              };
                          }
                        }
                        return {
                          id: g,
                          size: c,
                          description: m[g] || "Unknown",
                          data: e,
                        };
                      },
                    },
                    {
                      key: "getShortcuts",
                      value: function () {
                        return f;
                      },
                    },
                  ],
                  [
                    {
                      key: "getTagIdentifierByteRange",
                      value: function () {
                        return { offset: 0, length: 16 };
                      },
                    },
                    {
                      key: "canReadTagFormat",
                      value: function (a) {
                        return (
                          "ftyp" ===
                          String.fromCharCode.apply(String, a.slice(4, 8))
                        );
                      },
                    },
                  ]
                );
                return c;
              })(q);
              var t = {
                  0: "uint8",
                  1: "text",
                  13: "jpeg",
                  14: "png",
                  21: "int",
                  22: "uint",
                },
                m = {
                  "\u00a9alb": "Album",
                  "\u00a9ART": "Artist",
                  aART: "Album Artist",
                  "\u00a9day": "Release Date",
                  "\u00a9nam": "Title",
                  "\u00a9gen": "Genre",
                  gnre: "Genre",
                  trkn: "Track Number",
                  "\u00a9wrt": "Composer",
                  "\u00a9too": "Encoding Tool",
                  "\u00a9enc": "Encoded By",
                  cprt: "Copyright",
                  covr: "Cover Art",
                  "\u00a9grp": "Grouping",
                  keyw: "Keywords",
                  "\u00a9lyr": "Lyrics",
                  "\u00a9cmt": "Comment",
                  tmpo: "Tempo",
                  cpil: "Compilation",
                  disk: "Disc Number",
                  tvsh: "TV Show Name",
                  tven: "TV Episode ID",
                  tvsn: "TV Season",
                  tves: "TV Episode",
                  tvnn: "TV Network",
                  desc: "Description",
                  ldes: "Long Description",
                  sonm: "Sort Name",
                  soar: "Sort Artist",
                  soaa: "Sort Album",
                  soco: "Sort Composer",
                  sosn: "Sort Show",
                  purd: "Purchase Date",
                  pcst: "Podcast",
                  purl: "Podcast URL",
                  catg: "Category",
                  hdvd: "HD Video",
                  stik: "Media Type",
                  rtng: "Content Rating",
                  pgap: "Gapless Playback",
                  apID: "Purchase Account",
                  sfID: "Country Code",
                  atID: "Artist ID",
                  cnID: "Catalog ID",
                  plID: "Collection ID",
                  geID: "Genre ID",
                  "xid ": "Vendor Information",
                  flvr: "Codec Flavor",
                },
                f = {
                  title: "\u00a9nam",
                  artist: "\u00a9ART",
                  album: "\u00a9alb",
                  year: "\u00a9day",
                  comment: "\u00a9cmt",
                  track: "trkn",
                  genre: "\u00a9gen",
                  picture: "covr",
                  lyrics: "\u00a9lyr",
                };
              r.exports = d;
            },
            { "./MediaFileReader": 11, "./MediaTagReader": 12 },
          ],
          11: [
            function (d, r, q) {
              function n(e, b) {
                for (var h = 0; h < b.length; h++) {
                  var d = b[h];
                  d.enumerable = d.enumerable || !1;
                  d.configurable = !0;
                  "value" in d && (d.writable = !0);
                  Object.defineProperty(e, d.key, d);
                }
              }
              function u(e, b, h) {
                b && n(e.prototype, b);
                h && n(e, h);
                return e;
              }
              function v(e, b, h) {
                b in e
                  ? Object.defineProperty(e, b, {
                      value: h,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (e[b] = h);
                return e;
              }
              var p = d("./StringUtils");
              d = (function () {
                function e(b) {
                  if (!(this instanceof e))
                    throw new TypeError("Cannot call a class as a function");
                  v(this, "_isInitialized", void 0);
                  v(this, "_size", void 0);
                  this._isInitialized = !1;
                  this._size = 0;
                }
                u(
                  e,
                  [
                    {
                      key: "init",
                      value: function (b) {
                        var e = this;
                        if (this._isInitialized) setTimeout(b.onSuccess, 1);
                        else
                          return this._init({
                            onSuccess: function () {
                              e._isInitialized = !0;
                              b.onSuccess();
                            },
                            onError: b.onError,
                          });
                      },
                    },
                    {
                      key: "_init",
                      value: function (b) {
                        throw Error("Must implement init function");
                      },
                    },
                    {
                      key: "loadRange",
                      value: function (b, e) {
                        throw Error("Must implement loadRange function");
                      },
                    },
                    {
                      key: "getSize",
                      value: function () {
                        if (!this._isInitialized)
                          throw Error("init() must be called first.");
                        return this._size;
                      },
                    },
                    {
                      key: "getByteAt",
                      value: function (b) {
                        throw Error("Must implement getByteAt function");
                      },
                    },
                    {
                      key: "getBytesAt",
                      value: function (b, e) {
                        for (var h = Array(e), d = 0; d < e; d++)
                          h[d] = this.getByteAt(b + d);
                        return h;
                      },
                    },
                    {
                      key: "isBitSetAt",
                      value: function (b, e) {
                        return 0 != (this.getByteAt(b) & (1 << e));
                      },
                    },
                    {
                      key: "getSByteAt",
                      value: function (b) {
                        b = this.getByteAt(b);
                        return 127 < b ? b - 256 : b;
                      },
                    },
                    {
                      key: "getShortAt",
                      value: function (b, e) {
                        b = e
                          ? (this.getByteAt(b) << 8) + this.getByteAt(b + 1)
                          : (this.getByteAt(b + 1) << 8) + this.getByteAt(b);
                        0 > b && (b += 65536);
                        return b;
                      },
                    },
                    {
                      key: "getSShortAt",
                      value: function (b, e) {
                        b = this.getShortAt(b, e);
                        return 32767 < b ? b - 65536 : b;
                      },
                    },
                    {
                      key: "getLongAt",
                      value: function (b, e) {
                        var d = this.getByteAt(b),
                          h = this.getByteAt(b + 1),
                          m = this.getByteAt(b + 2);
                        b = this.getByteAt(b + 3);
                        e = e
                          ? (((((d << 8) + h) << 8) + m) << 8) + b
                          : (((((b << 8) + m) << 8) + h) << 8) + d;
                        0 > e && (e += 4294967296);
                        return e;
                      },
                    },
                    {
                      key: "getSLongAt",
                      value: function (b, e) {
                        b = this.getLongAt(b, e);
                        return 2147483647 < b ? b - 4294967296 : b;
                      },
                    },
                    {
                      key: "getInteger24At",
                      value: function (b, e) {
                        var d = this.getByteAt(b),
                          h = this.getByteAt(b + 1);
                        b = this.getByteAt(b + 2);
                        e = e
                          ? (((d << 8) + h) << 8) + b
                          : (((b << 8) + h) << 8) + d;
                        0 > e && (e += 16777216);
                        return e;
                      },
                    },
                    {
                      key: "getStringAt",
                      value: function (b, e) {
                        for (var d = [], h = b, m = 0; h < b + e; h++, m++)
                          d[m] = String.fromCharCode(this.getByteAt(h));
                        return d.join("");
                      },
                    },
                    {
                      key: "getStringWithCharsetAt",
                      value: function (b, e, d) {
                        b = this.getBytesAt(b, e);
                        switch ((d || "").toLowerCase()) {
                          case "utf-16":
                          case "utf-16le":
                          case "utf-16be":
                            d = p.readUTF16String(b, "utf-16be" === d);
                            break;
                          case "utf-8":
                            d = p.readUTF8String(b);
                            break;
                          default:
                            d = p.readNullTerminatedString(b);
                        }
                        return d;
                      },
                    },
                    {
                      key: "getCharAt",
                      value: function (b) {
                        return String.fromCharCode(this.getByteAt(b));
                      },
                    },
                    {
                      key: "getSynchsafeInteger32At",
                      value: function (b) {
                        var e = this.getByteAt(b),
                          d = this.getByteAt(b + 1),
                          p = this.getByteAt(b + 2);
                        return (
                          (this.getByteAt(b + 3) & 127) |
                          ((p & 127) << 7) |
                          ((d & 127) << 14) |
                          ((e & 127) << 21)
                        );
                      },
                    },
                  ],
                  [
                    {
                      key: "canReadFile",
                      value: function (b) {
                        throw Error("Must implement canReadFile function");
                      },
                    },
                  ]
                );
                return e;
              })();
              r.exports = d;
            },
            { "./StringUtils": 13 },
          ],
          12: [
            function (d, r, q) {
              function n(d, e) {
                for (var b = 0; b < e.length; b++) {
                  var h = e[b];
                  h.enumerable = h.enumerable || !1;
                  h.configurable = !0;
                  "value" in h && (h.writable = !0);
                  Object.defineProperty(d, h.key, h);
                }
              }
              function u(d, e, b) {
                e && n(d.prototype, e);
                b && n(d, b);
                return d;
              }
              function v(d, e, b) {
                e in d
                  ? Object.defineProperty(d, e, {
                      value: b,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (d[e] = b);
                return d;
              }
              d("./MediaFileReader");
              d = (function () {
                function d(e) {
                  if (!(this instanceof d))
                    throw new TypeError("Cannot call a class as a function");
                  v(this, "_mediaFileReader", void 0);
                  v(this, "_tags", void 0);
                  this._mediaFileReader = e;
                  this._tags = null;
                }
                u(
                  d,
                  [
                    {
                      key: "setTagsToRead",
                      value: function (e) {
                        this._tags = e;
                        return this;
                      },
                    },
                    {
                      key: "read",
                      value: function (e) {
                        var b = this;
                        this._mediaFileReader.init({
                          onSuccess: function () {
                            b._loadData(b._mediaFileReader, {
                              onSuccess: function () {
                                try {
                                  var d = b._parseData(b._mediaFileReader, b._tags);
                                } catch (l) {
                                  if (e.onError) {
                                    e.onError({
                                      type: "parseData",
                                      info: l.message,
                                    });
                                    return;
                                  }
                                }
                                e.onSuccess(d);
                              },
                              onError: e.onError,
                            });
                          },
                          onError: e.onError,
                        });
                      },
                    },
                    {
                      key: "getShortcuts",
                      value: function () {
                        return {};
                      },
                    },
                    {
                      key: "_loadData",
                      value: function (e, b) {
                        throw Error("Must implement _loadData function");
                      },
                    },
                    {
                      key: "_parseData",
                      value: function (e, b) {
                        throw Error("Must implement _parseData function");
                      },
                    },
                    {
                      key: "_expandShortcutTags",
                      value: function (e) {
                        if (!e) return null;
                        for (
                          var b = [], d = this.getShortcuts(), l = 0, n;
                          (n = e[l]);
                          l++
                        )
                          b = b.concat(d[n] || [n]);
                        return b;
                      },
                    },
                  ],
                  [
                    {
                      key: "getTagIdentifierByteRange",
                      value: function () {
                        throw Error("Must implement");
                      },
                    },
                    {
                      key: "canReadTagFormat",
                      value: function (e) {
                        throw Error("Must implement");
                      },
                    },
                  ]
                );
                return d;
              })();
              r.exports = d;
            },
            { "./MediaFileReader": 11 },
          ],
          13: [
            function (d, r, q) {
              function n(e, b) {
                for (var d = 0; d < b.length; d++) {
                  var l = b[d];
                  l.enumerable = l.enumerable || !1;
                  l.configurable = !0;
                  "value" in l && (l.writable = !0);
                  Object.defineProperty(e, l.key, l);
                }
              }
              function u(e, b, d) {
                b && n(e.prototype, b);
                d && n(e, d);
                return e;
              }
              function v(e, b, d) {
                b in e
                  ? Object.defineProperty(e, b, {
                      value: d,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (e[b] = d);
                return e;
              }
              var p = (function () {
                function e(b, d) {
                  if (!(this instanceof e))
                    throw new TypeError("Cannot call a class as a function");
                  v(this, "_value", void 0);
                  v(this, "bytesReadCount", void 0);
                  v(this, "length", void 0);
                  this._value = b;
                  this.bytesReadCount = d;
                  this.length = b.length;
                }
                u(e, [
                  {
                    key: "toString",
                    value: function () {
                      return this._value;
                    },
                  },
                ]);
                return e;
              })();
              r.exports = {
                readUTF16String: function (e, b, d) {
                  var h = 0,
                    n = 1,
                    m = 0;
                  d = Math.min(d || e.length, e.length);
                  254 == e[0] && 255 == e[1]
                    ? ((b = !0), (h = 2))
                    : 255 == e[0] && 254 == e[1] && ((b = !1), (h = 2));
                  b && ((n = 0), (m = 1));
                  b = [];
                  for (var f = 0; h < d; f++) {
                    var a = e[h + n],
                      c = (a << 8) + e[h + m];
                    h += 2;
                    if (0 == c) break;
                    else
                      216 > a || 224 <= a
                        ? (b[f] = String.fromCharCode(c))
                        : ((a = (e[h + n] << 8) + e[h + m]),
                          (h += 2),
                          (b[f] = String.fromCharCode(c, a)));
                  }
                  return new p(b.join(""), h);
                },
                readUTF8String: function (e, b) {
                  var d = 0;
                  b = Math.min(b || e.length, e.length);
                  239 == e[0] && 187 == e[1] && 191 == e[2] && (d = 3);
                  for (var l = [], n = 0; d < b; n++) {
                    var m = e[d++];
                    if (0 == m) break;
                    else if (128 > m) l[n] = String.fromCharCode(m);
                    else if (194 <= m && 224 > m) {
                      var f = e[d++];
                      l[n] = String.fromCharCode(((m & 31) << 6) + (f & 63));
                    } else if (224 <= m && 240 > m) {
                      f = e[d++];
                      var a = e[d++];
                      l[n] = String.fromCharCode(
                        ((m & 255) << 12) + ((f & 63) << 6) + (a & 63)
                      );
                    } else if (240 <= m && 245 > m) {
                      f = e[d++];
                      a = e[d++];
                      var c = e[d++];
                      a =
                        ((m & 7) << 18) +
                        ((f & 63) << 12) +
                        ((a & 63) << 6) +
                        (c & 63) -
                        65536;
                      l[n] = String.fromCharCode(
                        (a >> 10) + 55296,
                        (a & 1023) + 56320
                      );
                    }
                  }
                  return new p(l.join(""), d);
                },
                readNullTerminatedString: function (e, b) {
                  var d = [];
                  b = b || e.length;
                  for (var l = 0; l < b; ) {
                    var n = e[l++];
                    if (0 == n) break;
                    d[l - 1] = String.fromCharCode(n);
                  }
                  return new p(d.join(""), l);
                },
              };
            },
            {},
          ],
          14: [
            function (d, r, q) {
              function n(a) {
                "@babel/helpers - typeof";
                n =
                  "function" === typeof Symbol &&
                  "symbol" === typeof Symbol.iterator
                    ? function (a) {
                        return typeof a;
                      }
                    : function (a) {
                        return a &&
                          "function" === typeof Symbol &&
                          a.constructor === Symbol &&
                          a !== Symbol.prototype
                          ? "symbol"
                          : typeof a;
                      };
                return n(a);
              }
              function u(a, b) {
                for (var c = 0; c < b.length; c++) {
                  var d = b[c];
                  d.enumerable = d.enumerable || !1;
                  d.configurable = !0;
                  "value" in d && (d.writable = !0);
                  Object.defineProperty(a, d.key, d);
                }
              }
              function v(a, b, d) {
                b && u(a.prototype, b);
                d && u(a, d);
                return a;
              }
              function p(a, b) {
                if ("function" !== typeof b && null !== b)
                  throw new TypeError(
                    "Super expression must either be null or a function"
                  );
                a.prototype = Object.create(b && b.prototype, {
                  constructor: { value: a, writable: !0, configurable: !0 },
                });
                b && e(a, b);
              }
              function e(a, b) {
                e =
                  Object.setPrototypeOf ||
                  function (a, b) {
                    a.__proto__ = b;
                    return a;
                  };
                return e(a, b);
              }
              function b(a) {
                var b = l();
                return function () {
                  var c = t(a);
                  if (b) {
                    var d = t(this).constructor;
                    c = Reflect.construct(c, arguments, d);
                  } else c = c.apply(this, arguments);
                  c =
                    !c || ("object" !== n(c) && "function" !== typeof c)
                      ? h(this)
                      : c;
                  return c;
                };
              }
              function h(a) {
                if (void 0 === a)
                  throw new ReferenceError(
                    "this hasn't been initialised - super() hasn't been called"
                  );
                return a;
              }
              function l() {
                if (
                  "undefined" === typeof Reflect ||
                  !Reflect.construct ||
                  Reflect.construct.sham
                )
                  return !1;
                if ("function" === typeof Proxy) return !0;
                try {
                  return (
                    Boolean.prototype.valueOf.call(
                      Reflect.construct(Boolean, [], function () {})
                    ),
                    !0
                  );
                } catch (a) {
                  return !1;
                }
              }
              function t(a) {
                t = Object.setPrototypeOf
                  ? Object.getPrototypeOf
                  : function (a) {
                      return a.__proto__ || Object.getPrototypeOf(a);
                    };
                return t(a);
              }
              function m(a, b, d) {
                b in a
                  ? Object.defineProperty(a, b, {
                      value: d,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (a[b] = d);
                return a;
              }
              var f = d("./ChunkedFileData");
              q = (function (a) {
                function c(a) {
                  if (!(this instanceof c))
                    throw new TypeError("Cannot call a class as a function");
                  var b = e.call(this);
                  m(h(b), "_url", void 0);
                  m(h(b), "_fileData", void 0);
                  b._url = a;
                  b._fileData = new f();
                  return b;
                }
                p(c, a);
                var e = b(c);
                v(
                  c,
                  [
                    {
                      key: "_init",
                      value: function (a) {
                        c._config.avoidHeadRequests
                          ? this._fetchSizeWithGetRequest(a)
                          : this._fetchSizeWithHeadRequest(a);
                      },
                    },
                    {
                      key: "_fetchSizeWithHeadRequest",
                      value: function (a) {
                        var b = this;
                        this._makeXHRRequest("HEAD", null, {
                          onSuccess: function (c) {
                            (c = b._parseContentLength(c))
                              ? ((b._size = c), a.onSuccess())
                              : b._fetchSizeWithGetRequest(a);
                          },
                          onError: a.onError,
                        });
                      },
                    },
                    {
                      key: "_fetchSizeWithGetRequest",
                      value: function (a) {
                        var b = this,
                          c = this._roundRangeToChunkMultiple([0, 0]);
                        this._makeXHRRequest("GET", c, {
                          onSuccess: function (c) {
                            var d = b._parseContentRange(c);
                            c = b._getXhrResponseContent(c);
                            if (d) {
                              if (null == d.instanceLength) {
                                b._fetchEntireFile(a);
                                return;
                              }
                              b._size = d.instanceLength;
                            } else b._size = c.length;
                            b._fileData.addData(0, c);
                            a.onSuccess();
                          },
                          onError: a.onError,
                        });
                      },
                    },
                    {
                      key: "_fetchEntireFile",
                      value: function (a) {
                        var b = this;
                        this._makeXHRRequest("GET", null, {
                          onSuccess: function (c) {
                            c = b._getXhrResponseContent(c);
                            b._size = c.length;
                            b._fileData.addData(0, c);
                            a.onSuccess();
                          },
                          onError: a.onError,
                        });
                      },
                    },
                    {
                      key: "_getXhrResponseContent",
                      value: function (a) {
                        return a.responseBody || a.responseText || "";
                      },
                    },
                    {
                      key: "_parseContentLength",
                      value: function (a) {
                        a = this._getResponseHeader(a, "Content-Length");
                        return null == a ? a : parseInt(a, 10);
                      },
                    },
                    {
                      key: "_parseContentRange",
                      value: function (a) {
                        if ((a = this._getResponseHeader(a, "Content-Range"))) {
                          var b = a.match(/bytes (\d+)-(\d+)\/(?:(\d+)|\*)/i);
                          if (!b)
                            throw Error(
                              "FIXME: Unknown Content-Range syntax: " + a
                            );
                          return {
                            firstBytePosition: parseInt(b[1], 10),
                            lastBytePosition: parseInt(b[2], 10),
                            instanceLength: b[3] ? parseInt(b[3], 10) : null,
                          };
                        }
                        return null;
                      },
                    },
                    {
                      key: "loadRange",
                      value: function (a, b) {
                        var c = this;
                        c._fileData.hasDataRange(a[0], Math.min(c._size, a[1]))
                          ? setTimeout(b.onSuccess, 1)
                          : ((a = this._roundRangeToChunkMultiple(a)),
                            (a[1] = Math.min(c._size, a[1])),
                            this._makeXHRRequest("GET", a, {
                              onSuccess: function (d) {
                                d = c._getXhrResponseContent(d);
                                c._fileData.addData(a[0], d);
                                b.onSuccess();
                              },
                              onError: b.onError,
                            }));
                      },
                    },
                    {
                      key: "_roundRangeToChunkMultiple",
                      value: function (a) {
                        return [
                          a[0],
                          a[0] + 1024 * Math.ceil((a[1] - a[0] + 1) / 1024) - 1,
                        ];
                      },
                    },
                    {
                      key: "_makeXHRRequest",
                      value: function (a, b, d) {
                        var e = this._createXHRObject();
                        e.open(a, this._url);
                        var f = function () {
                          if (200 === e.status || 206 === e.status) d.onSuccess(e);
                          else if (d.onError)
                            d.onError({
                              type: "xhr",
                              info: "Unexpected HTTP status " + e.status + ".",
                              xhr: e,
                            });
                          e = null;
                        };
                        "undefined" !== typeof e.onload
                          ? ((e.onload = f),
                            (e.onerror = function () {
                              if (d.onError)
                                d.onError({
                                  type: "xhr",
                                  info: "Generic XHR error, check xhr object.",
                                  xhr: e,
                                });
                            }))
                          : (e.onreadystatechange = function () {
                              4 === e.readyState && f();
                            });
                        c._config.timeoutInSec &&
                          ((e.timeout = 1e3 * c._config.timeoutInSec),
                          (e.ontimeout = function () {
                            if (d.onError)
                              d.onError({
                                type: "xhr",
                                info:
                                  "Timeout after " +
                                  e.timeout / 1e3 +
                                  "s. Use jsmediatags.Config.setXhrTimeout to override.",
                                xhr: e,
                              });
                          }));
                        e.overrideMimeType("text/plain; charset=x-user-defined");
                        b &&
                          this._setRequestHeader(
                            e,
                            "Range",
                            "bytes=" + b[0] + "-" + b[1]
                          );
                        this._setRequestHeader(
                          e,
                          "If-Modified-Since",
                          "Sat, 01 Jan 1970 00:00:00 GMT"
                        );
                        e.send(null);
                      },
                    },
                    {
                      key: "_setRequestHeader",
                      value: function (a, b, d) {
                        0 >
                          c._config.disallowedXhrHeaders.indexOf(b.toLowerCase()) &&
                          a.setRequestHeader(b, d);
                      },
                    },
                    {
                      key: "_hasResponseHeader",
                      value: function (a, b) {
                        a = a.getAllResponseHeaders();
                        if (!a) return !1;
                        a = a.split("\r\n");
                        for (var c = [], d = 0; d < a.length; d++)
                          c[d] = a[d].split(":")[0].toLowerCase();
                        return 0 <= c.indexOf(b.toLowerCase());
                      },
                    },
                    {
                      key: "_getResponseHeader",
                      value: function (a, b) {
                        return this._hasResponseHeader(a, b)
                          ? a.getResponseHeader(b)
                          : null;
                      },
                    },
                    {
                      key: "getByteAt",
                      value: function (a) {
                        return this._fileData.getByteAt(a).charCodeAt(0) & 255;
                      },
                    },
                    {
                      key: "_isWebWorker",
                      value: function () {
                        return (
                          "undefined" !== typeof WorkerGlobalScope &&
                          self instanceof WorkerGlobalScope
                        );
                      },
                    },
                    {
                      key: "_createXHRObject",
                      value: function () {
                        if ("undefined" === typeof window && !this._isWebWorker())
                          return new (d("xhr2").XMLHttpRequest)();
                        if ("undefined" !== typeof XMLHttpRequest)
                          return new XMLHttpRequest();
                        throw Error("XMLHttpRequest is not supported");
                      },
                    },
                  ],
                  [
                    {
                      key: "canReadFile",
                      value: function (a) {
                        return "string" === typeof a && /^[a-z]+:\/\//i.test(a);
                      },
                    },
                    {
                      key: "setConfig",
                      value: function (a) {
                        for (var b in a)
                          a.hasOwnProperty(b) && (this._config[b] = a[b]);
                        a = this._config.disallowedXhrHeaders;
                        for (b = 0; b < a.length; b++) a[b] = a[b].toLowerCase();
                      },
                    },
                  ]
                );
                return c;
              })(d("./MediaFileReader"));
              m(q, "_config", void 0);
              q._config = {
                avoidHeadRequests: !1,
                disallowedXhrHeaders: [],
                timeoutInSec: 30,
              };
              r.exports = q;
            },
            { "./ChunkedFileData": 5, "./MediaFileReader": 11, xhr2: 2 },
          ],
          15: [
            function (d, r, q) {
              function n(a, b) {
                if (!(a instanceof b))
                  throw new TypeError("Cannot call a class as a function");
              }
              function u(a, b) {
                for (var c = 0; c < b.length; c++) {
                  var d = b[c];
                  d.enumerable = d.enumerable || !1;
                  d.configurable = !0;
                  "value" in d && (d.writable = !0);
                  Object.defineProperty(a, d.key, d);
                }
              }
              function v(a, b, c) {
                b && u(a.prototype, b);
                c && u(a, c);
                return a;
              }
              function p(a, b, c) {
                b in a
                  ? Object.defineProperty(a, b, {
                      value: c,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (a[b] = c);
                return a;
              }
              function e(a, b) {
                var c = 0 > a.offset && (-a.offset > b || 0 < a.offset + a.length);
                return !((0 <= a.offset && a.offset + a.length >= b) || c);
              }
              d("./MediaFileReader");
              var b = d("./XhrFileReader"),
                h = d("./BlobFileReader"),
                l = d("./ArrayFileReader");
              d("./MediaTagReader");
              var t = d("./ID3v1TagReader"),
                m = d("./ID3v2TagReader"),
                f = d("./MP4TagReader"),
                a = d("./FLACTagReader"),
                c = [],
                k = [],
                g = (function () {
                  function a(b) {
                    n(this, a);
                    p(this, "_file", void 0);
                    p(this, "_tagsToRead", void 0);
                    p(this, "_fileReader", void 0);
                    p(this, "_tagReader", void 0);
                    this._file = b;
                  }
                  v(a, [
                    {
                      key: "setTagsToRead",
                      value: function (a) {
                        this._tagsToRead = a;
                        return this;
                      },
                    },
                    {
                      key: "setFileReader",
                      value: function (a) {
                        this._fileReader = a;
                        return this;
                      },
                    },
                    {
                      key: "setTagReader",
                      value: function (a) {
                        this._tagReader = a;
                        return this;
                      },
                    },
                    {
                      key: "read",
                      value: function (a) {
                        var b = new (this._getFileReader())(this._file),
                          c = this;
                        b.init({
                          onSuccess: function () {
                            c._getTagReader(b, {
                              onSuccess: function (d) {
                                new d(b).setTagsToRead(c._tagsToRead).read(a);
                              },
                              onError: a.onError,
                            });
                          },
                          onError: a.onError,
                        });
                      },
                    },
                    {
                      key: "_getFileReader",
                      value: function () {
                        return this._fileReader
                          ? this._fileReader
                          : this._findFileReader();
                      },
                    },
                    {
                      key: "_findFileReader",
                      value: function () {
                        for (var a = 0; a < c.length; a++)
                          if (c[a].canReadFile(this._file)) return c[a];
                        throw Error(
                          "No suitable file reader found for " + this._file
                        );
                      },
                    },
                    {
                      key: "_getTagReader",
                      value: function (a, b) {
                        if (this._tagReader) {
                          var c = this._tagReader;
                          setTimeout(function () {
                            b.onSuccess(c);
                          }, 1);
                        } else this._findTagReader(a, b);
                      },
                    },
                    {
                      key: "_findTagReader",
                      value: function (a, b) {
                        for (
                          var c = [], d = [], f = a.getSize(), g = 0;
                          g < k.length;
                          g++
                        ) {
                          var h = k[g].getTagIdentifierByteRange();
                          e(h, f) &&
                            ((0 <= h.offset && h.offset < f / 2) ||
                            (0 > h.offset && h.offset < -f / 2)
                              ? c.push(k[g])
                              : d.push(k[g]));
                        }
                        var l = !1;
                        g = {
                          onSuccess: function () {
                            if (l) {
                              for (var c = 0; c < k.length; c++) {
                                var d = k[c].getTagIdentifierByteRange();
                                if (e(d, f)) {
                                  try {
                                    var g = a.getBytesAt(
                                      0 <= d.offset ? d.offset : d.offset + f,
                                      d.length
                                    );
                                  } catch (z) {
                                    if (b.onError)
                                      b.onError({
                                        type: "fileReader",
                                        info: z.message,
                                      });
                                    return;
                                  }
                                  if (k[c].canReadTagFormat(g)) {
                                    b.onSuccess(k[c]);
                                    return;
                                  }
                                }
                              }
                              if (b.onError)
                                b.onError({
                                  type: "tagFormat",
                                  info: "No suitable tag reader found",
                                });
                            } else l = !0;
                          },
                          onError: b.onError,
                        };
                        this._loadTagIdentifierRanges(a, c, g);
                        this._loadTagIdentifierRanges(a, d, g);
                      },
                    },
                    {
                      key: "_loadTagIdentifierRanges",
                      value: function (a, b, c) {
                        if (0 === b.length) setTimeout(c.onSuccess, 1);
                        else {
                          for (
                            var d = [Number.MAX_VALUE, 0], e = a.getSize(), f = 0;
                            f < b.length;
                            f++
                          ) {
                            var g = b[f].getTagIdentifierByteRange(),
                              h = 0 <= g.offset ? g.offset : g.offset + e;
                            g = h + g.length - 1;
                            d[0] = Math.min(h, d[0]);
                            d[1] = Math.max(g, d[1]);
                          }
                          a.loadRange(d, c);
                        }
                      },
                    },
                  ]);
                  return a;
                })();
              q = (function () {
                function a() {
                  n(this, a);
                }
                v(a, null, [
                  {
                    key: "addFileReader",
                    value: function (b) {
                      c.push(b);
                      return a;
                    },
                  },
                  {
                    key: "addTagReader",
                    value: function (b) {
                      k.push(b);
                      return a;
                    },
                  },
                  {
                    key: "removeTagReader",
                    value: function (b) {
                      b = k.indexOf(b);
                      0 <= b && k.splice(b, 1);
                      return a;
                    },
                  },
                  {
                    key: "EXPERIMENTAL_avoidHeadRequests",
                    value: function () {
                      b.setConfig({ avoidHeadRequests: !0 });
                    },
                  },
                  {
                    key: "setDisallowedXhrHeaders",
                    value: function (a) {
                      b.setConfig({ disallowedXhrHeaders: a });
                    },
                  },
                  {
                    key: "setXhrTimeoutInSec",
                    value: function (a) {
                      b.setConfig({ timeoutInSec: a });
                    },
                  },
                ]);
                return a;
              })();
              q.addFileReader(b)
                .addFileReader(h)
                .addFileReader(l)
                .addTagReader(m)
                .addTagReader(t)
                .addTagReader(f)
                .addTagReader(a);
              "undefined" === typeof process ||
                process.browser ||
                ((d =
                  "undefined" !== typeof navigator &&
                  "ReactNative" === navigator.product
                    ? d("./ReactNativeFileReader")
                    : d("./NodeFileReader")),
                q.addFileReader(d));
              r.exports = {
                read: function (a, b) {
                  new g(a).read(b);
                },
                Reader: g,
                Config: q,
              };
            },
            {
              "./ArrayFileReader": 3,
              "./BlobFileReader": 4,
              "./FLACTagReader": 6,
              "./ID3v1TagReader": 7,
              "./ID3v2TagReader": 9,
              "./MP4TagReader": 10,
              "./MediaFileReader": 11,
              "./MediaTagReader": 12,
              "./NodeFileReader": 1,
              "./ReactNativeFileReader": 1,
              "./XhrFileReader": 14,
            },
          ],
        },
        {},
        [15]
      )(15);
    });
    });

    var jsmediatags = /*#__PURE__*/_mergeNamespaces({
        __proto__: null,
        'default': jsmediatags_min
    }, [jsmediatags_min]);

    /**
     * [js-sha256]{@link https://github.com/emn178/js-sha256}
     *
     * @version 0.9.0
     * @author Chen, Yi-Cyuan [emn178@gmail.com]
     * @copyright Chen, Yi-Cyuan 2014-2017
     * @license MIT
     */

    var sha256 = createCommonjsModule(function (module) {
    /*jslint bitwise: true */
    (function () {

      var ERROR = 'input is invalid type';
      var WINDOW = typeof window === 'object';
      var root = WINDOW ? window : {};
      if (root.JS_SHA256_NO_WINDOW) {
        WINDOW = false;
      }
      var WEB_WORKER = !WINDOW && typeof self === 'object';
      var NODE_JS = !root.JS_SHA256_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
      if (NODE_JS) {
        root = commonjsGlobal;
      } else if (WEB_WORKER) {
        root = self;
      }
      var COMMON_JS = !root.JS_SHA256_NO_COMMON_JS && 'object' === 'object' && module.exports;
      var ARRAY_BUFFER = !root.JS_SHA256_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
      var HEX_CHARS = '0123456789abcdef'.split('');
      var EXTRA = [-2147483648, 8388608, 32768, 128];
      var SHIFT = [24, 16, 8, 0];
      var K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
      ];
      var OUTPUT_TYPES = ['hex', 'array', 'digest', 'arrayBuffer'];

      var blocks = [];

      if (root.JS_SHA256_NO_NODE_JS || !Array.isArray) {
        Array.isArray = function (obj) {
          return Object.prototype.toString.call(obj) === '[object Array]';
        };
      }

      if (ARRAY_BUFFER && (root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
        ArrayBuffer.isView = function (obj) {
          return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
        };
      }

      var createOutputMethod = function (outputType, is224) {
        return function (message) {
          return new Sha256(is224, true).update(message)[outputType]();
        };
      };

      var createMethod = function (is224) {
        var method = createOutputMethod('hex', is224);
        if (NODE_JS) {
          method = nodeWrap(method, is224);
        }
        method.create = function () {
          return new Sha256(is224);
        };
        method.update = function (message) {
          return method.create().update(message);
        };
        for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
          var type = OUTPUT_TYPES[i];
          method[type] = createOutputMethod(type, is224);
        }
        return method;
      };

      var nodeWrap = function (method, is224) {
        var crypto = eval("require('crypto')");
        var Buffer = eval("require('buffer').Buffer");
        var algorithm = is224 ? 'sha224' : 'sha256';
        var nodeMethod = function (message) {
          if (typeof message === 'string') {
            return crypto.createHash(algorithm).update(message, 'utf8').digest('hex');
          } else {
            if (message === null || message === undefined) {
              throw new Error(ERROR);
            } else if (message.constructor === ArrayBuffer) {
              message = new Uint8Array(message);
            }
          }
          if (Array.isArray(message) || ArrayBuffer.isView(message) ||
            message.constructor === Buffer) {
            return crypto.createHash(algorithm).update(new Buffer(message)).digest('hex');
          } else {
            return method(message);
          }
        };
        return nodeMethod;
      };

      var createHmacOutputMethod = function (outputType, is224) {
        return function (key, message) {
          return new HmacSha256(key, is224, true).update(message)[outputType]();
        };
      };

      var createHmacMethod = function (is224) {
        var method = createHmacOutputMethod('hex', is224);
        method.create = function (key) {
          return new HmacSha256(key, is224);
        };
        method.update = function (key, message) {
          return method.create(key).update(message);
        };
        for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
          var type = OUTPUT_TYPES[i];
          method[type] = createHmacOutputMethod(type, is224);
        }
        return method;
      };

      function Sha256(is224, sharedMemory) {
        if (sharedMemory) {
          blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
            blocks[4] = blocks[5] = blocks[6] = blocks[7] =
            blocks[8] = blocks[9] = blocks[10] = blocks[11] =
            blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
          this.blocks = blocks;
        } else {
          this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }

        if (is224) {
          this.h0 = 0xc1059ed8;
          this.h1 = 0x367cd507;
          this.h2 = 0x3070dd17;
          this.h3 = 0xf70e5939;
          this.h4 = 0xffc00b31;
          this.h5 = 0x68581511;
          this.h6 = 0x64f98fa7;
          this.h7 = 0xbefa4fa4;
        } else { // 256
          this.h0 = 0x6a09e667;
          this.h1 = 0xbb67ae85;
          this.h2 = 0x3c6ef372;
          this.h3 = 0xa54ff53a;
          this.h4 = 0x510e527f;
          this.h5 = 0x9b05688c;
          this.h6 = 0x1f83d9ab;
          this.h7 = 0x5be0cd19;
        }

        this.block = this.start = this.bytes = this.hBytes = 0;
        this.finalized = this.hashed = false;
        this.first = true;
        this.is224 = is224;
      }

      Sha256.prototype.update = function (message) {
        if (this.finalized) {
          return;
        }
        var notString, type = typeof message;
        if (type !== 'string') {
          if (type === 'object') {
            if (message === null) {
              throw new Error(ERROR);
            } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
              message = new Uint8Array(message);
            } else if (!Array.isArray(message)) {
              if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
                throw new Error(ERROR);
              }
            }
          } else {
            throw new Error(ERROR);
          }
          notString = true;
        }
        var code, index = 0, i, length = message.length, blocks = this.blocks;

        while (index < length) {
          if (this.hashed) {
            this.hashed = false;
            blocks[0] = this.block;
            blocks[16] = blocks[1] = blocks[2] = blocks[3] =
              blocks[4] = blocks[5] = blocks[6] = blocks[7] =
              blocks[8] = blocks[9] = blocks[10] = blocks[11] =
              blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
          }

          if (notString) {
            for (i = this.start; index < length && i < 64; ++index) {
              blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
            }
          } else {
            for (i = this.start; index < length && i < 64; ++index) {
              code = message.charCodeAt(index);
              if (code < 0x80) {
                blocks[i >> 2] |= code << SHIFT[i++ & 3];
              } else if (code < 0x800) {
                blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
              } else if (code < 0xd800 || code >= 0xe000) {
                blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
              } else {
                code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
                blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
                blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
              }
            }
          }

          this.lastByteIndex = i;
          this.bytes += i - this.start;
          if (i >= 64) {
            this.block = blocks[16];
            this.start = i - 64;
            this.hash();
            this.hashed = true;
          } else {
            this.start = i;
          }
        }
        if (this.bytes > 4294967295) {
          this.hBytes += this.bytes / 4294967296 << 0;
          this.bytes = this.bytes % 4294967296;
        }
        return this;
      };

      Sha256.prototype.finalize = function () {
        if (this.finalized) {
          return;
        }
        this.finalized = true;
        var blocks = this.blocks, i = this.lastByteIndex;
        blocks[16] = this.block;
        blocks[i >> 2] |= EXTRA[i & 3];
        this.block = blocks[16];
        if (i >= 56) {
          if (!this.hashed) {
            this.hash();
          }
          blocks[0] = this.block;
          blocks[16] = blocks[1] = blocks[2] = blocks[3] =
            blocks[4] = blocks[5] = blocks[6] = blocks[7] =
            blocks[8] = blocks[9] = blocks[10] = blocks[11] =
            blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
        }
        blocks[14] = this.hBytes << 3 | this.bytes >>> 29;
        blocks[15] = this.bytes << 3;
        this.hash();
      };

      Sha256.prototype.hash = function () {
        var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4, f = this.h5, g = this.h6,
          h = this.h7, blocks = this.blocks, j, s0, s1, maj, t1, t2, ch, ab, da, cd, bc;

        for (j = 16; j < 64; ++j) {
          // rightrotate
          t1 = blocks[j - 15];
          s0 = ((t1 >>> 7) | (t1 << 25)) ^ ((t1 >>> 18) | (t1 << 14)) ^ (t1 >>> 3);
          t1 = blocks[j - 2];
          s1 = ((t1 >>> 17) | (t1 << 15)) ^ ((t1 >>> 19) | (t1 << 13)) ^ (t1 >>> 10);
          blocks[j] = blocks[j - 16] + s0 + blocks[j - 7] + s1 << 0;
        }

        bc = b & c;
        for (j = 0; j < 64; j += 4) {
          if (this.first) {
            if (this.is224) {
              ab = 300032;
              t1 = blocks[0] - 1413257819;
              h = t1 - 150054599 << 0;
              d = t1 + 24177077 << 0;
            } else {
              ab = 704751109;
              t1 = blocks[0] - 210244248;
              h = t1 - 1521486534 << 0;
              d = t1 + 143694565 << 0;
            }
            this.first = false;
          } else {
            s0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
            s1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
            ab = a & b;
            maj = ab ^ (a & c) ^ bc;
            ch = (e & f) ^ (~e & g);
            t1 = h + s1 + ch + K[j] + blocks[j];
            t2 = s0 + maj;
            h = d + t1 << 0;
            d = t1 + t2 << 0;
          }
          s0 = ((d >>> 2) | (d << 30)) ^ ((d >>> 13) | (d << 19)) ^ ((d >>> 22) | (d << 10));
          s1 = ((h >>> 6) | (h << 26)) ^ ((h >>> 11) | (h << 21)) ^ ((h >>> 25) | (h << 7));
          da = d & a;
          maj = da ^ (d & b) ^ ab;
          ch = (h & e) ^ (~h & f);
          t1 = g + s1 + ch + K[j + 1] + blocks[j + 1];
          t2 = s0 + maj;
          g = c + t1 << 0;
          c = t1 + t2 << 0;
          s0 = ((c >>> 2) | (c << 30)) ^ ((c >>> 13) | (c << 19)) ^ ((c >>> 22) | (c << 10));
          s1 = ((g >>> 6) | (g << 26)) ^ ((g >>> 11) | (g << 21)) ^ ((g >>> 25) | (g << 7));
          cd = c & d;
          maj = cd ^ (c & a) ^ da;
          ch = (g & h) ^ (~g & e);
          t1 = f + s1 + ch + K[j + 2] + blocks[j + 2];
          t2 = s0 + maj;
          f = b + t1 << 0;
          b = t1 + t2 << 0;
          s0 = ((b >>> 2) | (b << 30)) ^ ((b >>> 13) | (b << 19)) ^ ((b >>> 22) | (b << 10));
          s1 = ((f >>> 6) | (f << 26)) ^ ((f >>> 11) | (f << 21)) ^ ((f >>> 25) | (f << 7));
          bc = b & c;
          maj = bc ^ (b & d) ^ cd;
          ch = (f & g) ^ (~f & h);
          t1 = e + s1 + ch + K[j + 3] + blocks[j + 3];
          t2 = s0 + maj;
          e = a + t1 << 0;
          a = t1 + t2 << 0;
        }

        this.h0 = this.h0 + a << 0;
        this.h1 = this.h1 + b << 0;
        this.h2 = this.h2 + c << 0;
        this.h3 = this.h3 + d << 0;
        this.h4 = this.h4 + e << 0;
        this.h5 = this.h5 + f << 0;
        this.h6 = this.h6 + g << 0;
        this.h7 = this.h7 + h << 0;
      };

      Sha256.prototype.hex = function () {
        this.finalize();

        var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5,
          h6 = this.h6, h7 = this.h7;

        var hex = HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +
          HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +
          HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +
          HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
          HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +
          HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +
          HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +
          HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
          HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +
          HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +
          HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +
          HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
          HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F] +
          HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +
          HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +
          HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
          HEX_CHARS[(h4 >> 28) & 0x0F] + HEX_CHARS[(h4 >> 24) & 0x0F] +
          HEX_CHARS[(h4 >> 20) & 0x0F] + HEX_CHARS[(h4 >> 16) & 0x0F] +
          HEX_CHARS[(h4 >> 12) & 0x0F] + HEX_CHARS[(h4 >> 8) & 0x0F] +
          HEX_CHARS[(h4 >> 4) & 0x0F] + HEX_CHARS[h4 & 0x0F] +
          HEX_CHARS[(h5 >> 28) & 0x0F] + HEX_CHARS[(h5 >> 24) & 0x0F] +
          HEX_CHARS[(h5 >> 20) & 0x0F] + HEX_CHARS[(h5 >> 16) & 0x0F] +
          HEX_CHARS[(h5 >> 12) & 0x0F] + HEX_CHARS[(h5 >> 8) & 0x0F] +
          HEX_CHARS[(h5 >> 4) & 0x0F] + HEX_CHARS[h5 & 0x0F] +
          HEX_CHARS[(h6 >> 28) & 0x0F] + HEX_CHARS[(h6 >> 24) & 0x0F] +
          HEX_CHARS[(h6 >> 20) & 0x0F] + HEX_CHARS[(h6 >> 16) & 0x0F] +
          HEX_CHARS[(h6 >> 12) & 0x0F] + HEX_CHARS[(h6 >> 8) & 0x0F] +
          HEX_CHARS[(h6 >> 4) & 0x0F] + HEX_CHARS[h6 & 0x0F];
        if (!this.is224) {
          hex += HEX_CHARS[(h7 >> 28) & 0x0F] + HEX_CHARS[(h7 >> 24) & 0x0F] +
            HEX_CHARS[(h7 >> 20) & 0x0F] + HEX_CHARS[(h7 >> 16) & 0x0F] +
            HEX_CHARS[(h7 >> 12) & 0x0F] + HEX_CHARS[(h7 >> 8) & 0x0F] +
            HEX_CHARS[(h7 >> 4) & 0x0F] + HEX_CHARS[h7 & 0x0F];
        }
        return hex;
      };

      Sha256.prototype.toString = Sha256.prototype.hex;

      Sha256.prototype.digest = function () {
        this.finalize();

        var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5,
          h6 = this.h6, h7 = this.h7;

        var arr = [
          (h0 >> 24) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 8) & 0xFF, h0 & 0xFF,
          (h1 >> 24) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 8) & 0xFF, h1 & 0xFF,
          (h2 >> 24) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 8) & 0xFF, h2 & 0xFF,
          (h3 >> 24) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 8) & 0xFF, h3 & 0xFF,
          (h4 >> 24) & 0xFF, (h4 >> 16) & 0xFF, (h4 >> 8) & 0xFF, h4 & 0xFF,
          (h5 >> 24) & 0xFF, (h5 >> 16) & 0xFF, (h5 >> 8) & 0xFF, h5 & 0xFF,
          (h6 >> 24) & 0xFF, (h6 >> 16) & 0xFF, (h6 >> 8) & 0xFF, h6 & 0xFF
        ];
        if (!this.is224) {
          arr.push((h7 >> 24) & 0xFF, (h7 >> 16) & 0xFF, (h7 >> 8) & 0xFF, h7 & 0xFF);
        }
        return arr;
      };

      Sha256.prototype.array = Sha256.prototype.digest;

      Sha256.prototype.arrayBuffer = function () {
        this.finalize();

        var buffer = new ArrayBuffer(this.is224 ? 28 : 32);
        var dataView = new DataView(buffer);
        dataView.setUint32(0, this.h0);
        dataView.setUint32(4, this.h1);
        dataView.setUint32(8, this.h2);
        dataView.setUint32(12, this.h3);
        dataView.setUint32(16, this.h4);
        dataView.setUint32(20, this.h5);
        dataView.setUint32(24, this.h6);
        if (!this.is224) {
          dataView.setUint32(28, this.h7);
        }
        return buffer;
      };

      function HmacSha256(key, is224, sharedMemory) {
        var i, type = typeof key;
        if (type === 'string') {
          var bytes = [], length = key.length, index = 0, code;
          for (i = 0; i < length; ++i) {
            code = key.charCodeAt(i);
            if (code < 0x80) {
              bytes[index++] = code;
            } else if (code < 0x800) {
              bytes[index++] = (0xc0 | (code >> 6));
              bytes[index++] = (0x80 | (code & 0x3f));
            } else if (code < 0xd800 || code >= 0xe000) {
              bytes[index++] = (0xe0 | (code >> 12));
              bytes[index++] = (0x80 | ((code >> 6) & 0x3f));
              bytes[index++] = (0x80 | (code & 0x3f));
            } else {
              code = 0x10000 + (((code & 0x3ff) << 10) | (key.charCodeAt(++i) & 0x3ff));
              bytes[index++] = (0xf0 | (code >> 18));
              bytes[index++] = (0x80 | ((code >> 12) & 0x3f));
              bytes[index++] = (0x80 | ((code >> 6) & 0x3f));
              bytes[index++] = (0x80 | (code & 0x3f));
            }
          }
          key = bytes;
        } else {
          if (type === 'object') {
            if (key === null) {
              throw new Error(ERROR);
            } else if (ARRAY_BUFFER && key.constructor === ArrayBuffer) {
              key = new Uint8Array(key);
            } else if (!Array.isArray(key)) {
              if (!ARRAY_BUFFER || !ArrayBuffer.isView(key)) {
                throw new Error(ERROR);
              }
            }
          } else {
            throw new Error(ERROR);
          }
        }

        if (key.length > 64) {
          key = (new Sha256(is224, true)).update(key).array();
        }

        var oKeyPad = [], iKeyPad = [];
        for (i = 0; i < 64; ++i) {
          var b = key[i] || 0;
          oKeyPad[i] = 0x5c ^ b;
          iKeyPad[i] = 0x36 ^ b;
        }

        Sha256.call(this, is224, sharedMemory);

        this.update(iKeyPad);
        this.oKeyPad = oKeyPad;
        this.inner = true;
        this.sharedMemory = sharedMemory;
      }
      HmacSha256.prototype = new Sha256();

      HmacSha256.prototype.finalize = function () {
        Sha256.prototype.finalize.call(this);
        if (this.inner) {
          this.inner = false;
          var innerHash = this.array();
          Sha256.call(this, this.is224, this.sharedMemory);
          this.update(this.oKeyPad);
          this.update(innerHash);
          Sha256.prototype.finalize.call(this);
        }
      };

      var exports = createMethod();
      exports.sha256 = exports;
      exports.sha224 = createMethod(true);
      exports.sha256.hmac = createHmacMethod();
      exports.sha224.hmac = createHmacMethod(true);

      if (COMMON_JS) {
        module.exports = exports;
      } else {
        root.sha256 = exports.sha256;
        root.sha224 = exports.sha224;
      }
    })();
    });

    /* src/components/PlayerApp/LocalSearch.svelte generated by Svelte v3.48.0 */

    const { console: console_1 } = globals;
    const file$1 = "src/components/PlayerApp/LocalSearch.svelte";

    // (73:0) <Popup popupFlag={FLAG_LOCAL_SEARCH_POPUP}>
    function create_default_slot$1(ctx) {
    	let div0;
    	let t1;
    	let div1;
    	let input;
    	let t2;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "로컬 음원파일 선택";
    			t1 = space();
    			div1 = element("div");
    			input = element("input");
    			t2 = space();
    			button = element("button");
    			button.textContent = "추가";
    			attr_dev(div0, "class", "viewport-title svelte-doxa78");
    			add_location(div0, file$1, 73, 2, 2997);
    			attr_dev(input, "type", "file");
    			attr_dev(input, "accept", ".mp3,.wav,.flac");
    			attr_dev(input, "class", "svelte-doxa78");
    			add_location(input, file$1, 75, 4, 3072);
    			attr_dev(button, "class", "svelte-doxa78");
    			add_location(button, file$1, 76, 4, 3147);
    			attr_dev(div1, "class", "frm-input svelte-doxa78");
    			add_location(div1, file$1, 74, 2, 3044);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, input);
    			append_dev(div1, t2);
    			append_dev(div1, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_handler*/ ctx[2]),
    					listen_dev(button, "click", /*onClickAddBtn*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(73:0) <Popup popupFlag={FLAG_LOCAL_SEARCH_POPUP}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let popup;
    	let current;

    	popup = new Popup({
    			props: {
    				popupFlag: FLAG_LOCAL_SEARCH_POPUP,
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(popup.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(popup, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const popup_changes = {};

    			if (dirty & /*$$scope, localFiles*/ 33) {
    				popup_changes.$$scope = { dirty, ctx };
    			}

    			popup.$set(popup_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(popup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(popup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(popup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $PLAYLIST;
    	validate_store(PLAYLIST, 'PLAYLIST');
    	component_subscribe($$self, PLAYLIST, $$value => $$invalidate(3, $PLAYLIST = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LocalSearch', slots, []);
    	let localFiles;

    	const addPlayListLocalFile = async (file, songId, title, artist) => {
    		const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    		audioContext.decodeAudioData(await file.arrayBuffer(), buf => {
    			const duration = buf.duration;

    			$PLAYLIST.queue.push({
    				type: "local",
    				songId,
    				title,
    				artist,
    				duration: getDurationNumToStr(duration)
    			});

    			savePlayList();
    			successToast("플레이리스트에 추가되었습니다.");
    			LOADING_SCREEN_SAVER_MSG.set("");
    			FLAG_LOADING_SCREEN_SAVER.set(false);
    			FLAG_LOCAL_SEARCH_POPUP.set(false);
    		});
    	};

    	/**
     * 재생 대기열에 ytSearchID에 해당하는 YouTube 영상 정보를 추가하는 함수
     */
    	const onClickAddBtn = async () => {
    		LOADING_SCREEN_SAVER_MSG.set("재생대기열에 추가 중...");
    		FLAG_LOADING_SCREEN_SAVER.set(true);

    		if (localFiles.length !== 0) {
    			const reader = new FileReader();

    			reader.onload = event => {
    				const fileContent = reader.result;
    				const songId = sha256.sha256(fileContent);
    				const indexedDB = window.indexedDB.open("streamMusic");

    				indexedDB.onerror = event => {
    					
    				};

    				indexedDB.onsuccess = event => {
    					const db = indexedDB.result;
    					const transaction = db.transaction(["streamMusic"], "readwrite");

    					transaction.onerror = event => {
    						console.log("transaction fail");
    					};

    					const store = transaction.objectStore("streamMusic");
    					const storeRequest = store.get(songId);

    					storeRequest.onsuccess = event => {
    						if (!storeRequest.result) {
    							store.add({
    								id: songId,
    								name: localFiles[0].name,
    								file: fileContent
    							});
    						}

    						jsmediatags_min.read(localFiles[0], {
    							onSuccess: async tag => {
    								addPlayListLocalFile(localFiles[0], songId, tag.tags.album, tag.tags.artist);
    							},
    							onError: async err => {
    								addPlayListLocalFile(localFiles[0], songId, localFiles[0].name, "missing");
    							}
    						});
    					};

    					storeRequest.onerror = event => {
    						
    					};
    				};
    			};

    			reader.readAsText(localFiles[0]);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<LocalSearch> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler() {
    		localFiles = this.files;
    		$$invalidate(0, localFiles);
    	}

    	$$self.$capture_state = () => ({
    		jsmediatags,
    		sha256: sha256.sha256,
    		successToast,
    		FLAG_LOADING_SCREEN_SAVER,
    		FLAG_LOCAL_SEARCH_POPUP,
    		LOADING_SCREEN_SAVER_MSG,
    		PLAYLIST,
    		savePlayList,
    		getDurationNumToStr,
    		Popup,
    		localFiles,
    		addPlayListLocalFile,
    		onClickAddBtn,
    		$PLAYLIST
    	});

    	$$self.$inject_state = $$props => {
    		if ('localFiles' in $$props) $$invalidate(0, localFiles = $$props.localFiles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [localFiles, onClickAddBtn, input_change_handler];
    }

    class LocalSearch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LocalSearch",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    (() => {
        const agent = window.navigator.userAgent.toLowerCase();
        if (agent.indexOf("mobile") !== -1) {
            FLAG_PROTECTOR.set(true);
            PROTECTOR_CONTENT.set("모바일은 지원하지 않습니다.");
        }
        if (!window.indexedDB) {
            FLAG_PROTECTOR.set(true);
            PROTECTOR_CONTENT.set("해당 브라우저는 IndexedDB를 지원하지 않습니다.<br>Chrome 브라우저를 통해 접속하는 것을 권장합니다.");
        }
        else {
            const indexedDB = window.indexedDB.open("streamMusic");
            indexedDB.onupgradeneeded = (event) => {
                const db = indexedDB.result;
                db.createObjectStore("streamMusic", {
                    keyPath: "id",
                });
                indexedDB.onerror = (event) => {
                    FLAG_PROTECTOR.set(true);
                    PROTECTOR_CONTENT.set("해당 브라우저는 IndexedDB를 지원하지 않습니다.<br>Chrome 브라우저를 통해 접속하는 것을 권장합니다.");
                };
            };
        }
        // 실수로 페이지를 빠져나가는 것을 방지
        window.addEventListener("beforeunload", (event) => {
            event.preventDefault();
            event.returnValue = "";
        });
        FLAG_NETWORK_STATUS.set(window.navigator.onLine);
        if (!window.navigator.onLine) {
            errorToast("네트워크가 연결되지 않았습니다. 연결상태를 확인하세요.");
        }
        window.addEventListener("online", () => {
            infoToast("네트워크가 연결되었습니다.");
            FLAG_NETWORK_STATUS.set(true);
        });
        window.addEventListener("offline", () => {
            errorToast("네트워크가 해제가 감지되었습니다.");
            FLAG_NETWORK_STATUS.set(false);
        });
    })();

    /* src/components/PlayerApp/index.svelte generated by Svelte v3.48.0 */
    const file = "src/components/PlayerApp/index.svelte";

    // (19:2) <ToastContainer let:data>
    function create_default_slot_1(ctx) {
    	let flattoast;
    	let current;

    	flattoast = new FlatToast({
    			props: { data: /*data*/ ctx[11] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(flattoast.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(flattoast, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const flattoast_changes = {};
    			if (dirty & /*data*/ 2048) flattoast_changes.data = /*data*/ ctx[11];
    			flattoast.$set(flattoast_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(flattoast.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(flattoast.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(flattoast, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(19:2) <ToastContainer let:data>",
    		ctx
    	});

    	return block;
    }

    // (23:2) {#if $FLAG_LOADING_SCREEN_SAVER}
    function create_if_block_4(ctx) {
    	let loadingscreensaver;
    	let current;
    	loadingscreensaver = new LoadingScreenSaver({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loadingscreensaver.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingscreensaver, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingscreensaver.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingscreensaver.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingscreensaver, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(23:2) {#if $FLAG_LOADING_SCREEN_SAVER}",
    		ctx
    	});

    	return block;
    }

    // (26:2) {#if $FLAG_YT_SEARCH_POPUP}
    function create_if_block_3(ctx) {
    	let ytsearch;
    	let current;
    	ytsearch = new YTSearch({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(ytsearch.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(ytsearch, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ytsearch.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ytsearch.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(ytsearch, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(26:2) {#if $FLAG_YT_SEARCH_POPUP}",
    		ctx
    	});

    	return block;
    }

    // (29:2) {#if $FLAG_LOCAL_SEARCH_POPUP}
    function create_if_block_2(ctx) {
    	let localsearch;
    	let current;
    	localsearch = new LocalSearch({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(localsearch.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(localsearch, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(localsearch.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(localsearch.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(localsearch, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(29:2) {#if $FLAG_LOCAL_SEARCH_POPUP}",
    		ctx
    	});

    	return block;
    }

    // (92:43) {:else}
    function create_else_block(ctx) {
    	let div;
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM176 168V344C176 352.7 180.7 360.7 188.3 364.9C195.8 369.2 205.1 369 212.5 364.5L356.5 276.5C363.6 272.1 368 264.4 368 256C368 247.6 363.6 239.9 356.5 235.5L212.5 147.5C205.1 142.1 195.8 142.8 188.3 147.1C180.7 151.3 176 159.3 176 168V168z");
    			add_location(path, file, 97, 17, 6961);
    			attr_dev(svg, "class", "icon play svelte-1csrg2k");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file, 93, 14, 6816);
    			attr_dev(div, "id", "none-song");
    			attr_dev(div, "class", "svelte-1csrg2k");
    			add_location(div, file, 92, 12, 6781);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(92:43) {:else}",
    		ctx
    	});

    	return block;
    }

    // (92:43) 
    function create_if_block_1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(92:43) ",
    		ctx
    	});

    	return block;
    }

    // (90:10) {#if $YT_VIDEO_ID != ""}
    function create_if_block(ctx) {
    	let ytplayer;
    	let current;
    	ytplayer = new YTPlayer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(ytplayer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(ytplayer, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ytplayer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ytplayer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(ytplayer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(90:10) {#if $YT_VIDEO_ID != \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (18:0) <Protector>
    function create_default_slot(ctx) {
    	let toastcontainer;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let historylist;
    	let t4;
    	let div2;
    	let div0;
    	let t5;
    	let h1;
    	let t7;
    	let div1;
    	let span2;
    	let svg0;
    	let path0;
    	let t8;
    	let span0;
    	let t10;
    	let span1;
    	let indicator0;
    	let t11;
    	let span5;
    	let svg1;
    	let path1;
    	let t12;
    	let span3;
    	let t14;
    	let span4;
    	let indicator1;
    	let t15;
    	let div16;
    	let div5;
    	let songcontrol;
    	let t16;
    	let div4;
    	let div3;
    	let btn0;
    	let t17;
    	let div15;
    	let div9;
    	let div6;
    	let current_block_type_index;
    	let if_block3;
    	let t18;
    	let div8;
    	let div7;
    	let t20;
    	let nowplaying;
    	let t21;
    	let div14;
    	let div12;
    	let div10;
    	let t23;
    	let div11;
    	let btn1;
    	let t24;
    	let btn2;
    	let t25;
    	let btn3;
    	let t26;
    	let table;
    	let colgroup;
    	let col0;
    	let t27;
    	let col1;
    	let t28;
    	let col2;
    	let t29;
    	let col3;
    	let t30;
    	let col4;
    	let t31;
    	let col5;
    	let t32;
    	let thead;
    	let tr;
    	let th0;
    	let t34;
    	let th1;
    	let t36;
    	let th2;
    	let t38;
    	let th3;
    	let t40;
    	let th4;
    	let t42;
    	let th5;
    	let t44;
    	let div13;
    	let playlisttable;
    	let current;

    	toastcontainer = new ToastContainer({
    			props: {
    				$$slots: {
    					default: [
    						create_default_slot_1,
    						({ data }) => ({ 11: data }),
    						({ data }) => data ? 2048 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*$FLAG_LOADING_SCREEN_SAVER*/ ctx[0] && create_if_block_4(ctx);
    	let if_block1 = /*$FLAG_YT_SEARCH_POPUP*/ ctx[1] && create_if_block_3(ctx);
    	let if_block2 = /*$FLAG_LOCAL_SEARCH_POPUP*/ ctx[2] && create_if_block_2(ctx);
    	historylist = new HistoryList({ $$inline: true });

    	indicator0 = new Indicator({
    			props: { state: /*$FLAG_NETWORK_STATUS*/ ctx[3] },
    			$$inline: true
    		});

    	indicator1 = new Indicator({
    			props: { state: /*$FLAG_CLIENT_STATUS*/ ctx[4] },
    			$$inline: true
    		});

    	songcontrol = new SongControl({ $$inline: true });

    	btn0 = new Btn({
    			props: {
    				defaultLabel: `<svg style="position: relative; top: .1em; width: 1em; height: 1em; margin-right: .2em; fill: white;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M495.9 166.6C499.2 175.2 496.4 184.9 489.6 191.2L446.3 230.6C447.4 238.9 448 247.4 448 256C448 264.6 447.4 273.1 446.3 281.4L489.6 320.8C496.4 327.1 499.2 336.8 495.9 345.4C491.5 357.3 486.2 368.8 480.2 379.7L475.5 387.8C468.9 398.8 461.5 409.2 453.4 419.1C447.4 426.2 437.7 428.7 428.9 425.9L373.2 408.1C359.8 418.4 344.1 427 329.2 433.6L316.7 490.7C314.7 499.7 307.7 506.1 298.5 508.5C284.7 510.8 270.5 512 255.1 512C241.5 512 227.3 510.8 213.5 508.5C204.3 506.1 197.3 499.7 195.3 490.7L182.8 433.6C167 427 152.2 418.4 138.8 408.1L83.14 425.9C74.3 428.7 64.55 426.2 58.63 419.1C50.52 409.2 43.12 398.8 36.52 387.8L31.84 379.7C25.77 368.8 20.49 357.3 16.06 345.4C12.82 336.8 15.55 327.1 22.41 320.8L65.67 281.4C64.57 273.1 64 264.6 64 256C64 247.4 64.57 238.9 65.67 230.6L22.41 191.2C15.55 184.9 12.82 175.3 16.06 166.6C20.49 154.7 25.78 143.2 31.84 132.3L36.51 124.2C43.12 113.2 50.52 102.8 58.63 92.95C64.55 85.8 74.3 83.32 83.14 86.14L138.8 103.9C152.2 93.56 167 84.96 182.8 78.43L195.3 21.33C197.3 12.25 204.3 5.04 213.5 3.51C227.3 1.201 241.5 0 256 0C270.5 0 284.7 1.201 298.5 3.51C307.7 5.04 314.7 12.25 316.7 21.33L329.2 78.43C344.1 84.96 359.8 93.56 373.2 103.9L428.9 86.14C437.7 83.32 447.4 85.8 453.4 92.95C461.5 102.8 468.9 113.2 475.5 124.2L480.2 132.3C486.2 143.2 491.5 154.7 495.9 166.6V166.6zM256 336C300.2 336 336 300.2 336 255.1C336 211.8 300.2 175.1 256 175.1C211.8 175.1 176 211.8 176 255.1C176 300.2 211.8 336 256 336z"/></svg> 설정`,
    				minLabel: `<svg style="position: relative; top: .1em; width: 1em; height: 1em; fill: white;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M495.9 166.6C499.2 175.2 496.4 184.9 489.6 191.2L446.3 230.6C447.4 238.9 448 247.4 448 256C448 264.6 447.4 273.1 446.3 281.4L489.6 320.8C496.4 327.1 499.2 336.8 495.9 345.4C491.5 357.3 486.2 368.8 480.2 379.7L475.5 387.8C468.9 398.8 461.5 409.2 453.4 419.1C447.4 426.2 437.7 428.7 428.9 425.9L373.2 408.1C359.8 418.4 344.1 427 329.2 433.6L316.7 490.7C314.7 499.7 307.7 506.1 298.5 508.5C284.7 510.8 270.5 512 255.1 512C241.5 512 227.3 510.8 213.5 508.5C204.3 506.1 197.3 499.7 195.3 490.7L182.8 433.6C167 427 152.2 418.4 138.8 408.1L83.14 425.9C74.3 428.7 64.55 426.2 58.63 419.1C50.52 409.2 43.12 398.8 36.52 387.8L31.84 379.7C25.77 368.8 20.49 357.3 16.06 345.4C12.82 336.8 15.55 327.1 22.41 320.8L65.67 281.4C64.57 273.1 64 264.6 64 256C64 247.4 64.57 238.9 65.67 230.6L22.41 191.2C15.55 184.9 12.82 175.3 16.06 166.6C20.49 154.7 25.78 143.2 31.84 132.3L36.51 124.2C43.12 113.2 50.52 102.8 58.63 92.95C64.55 85.8 74.3 83.32 83.14 86.14L138.8 103.9C152.2 93.56 167 84.96 182.8 78.43L195.3 21.33C197.3 12.25 204.3 5.04 213.5 3.51C227.3 1.201 241.5 0 256 0C270.5 0 284.7 1.201 298.5 3.51C307.7 5.04 314.7 12.25 316.7 21.33L329.2 78.43C344.1 84.96 359.8 93.56 373.2 103.9L428.9 86.14C437.7 83.32 447.4 85.8 453.4 92.95C461.5 102.8 468.9 113.2 475.5 124.2L480.2 132.3C486.2 143.2 491.5 154.7 495.9 166.6V166.6zM256 336C300.2 336 336 300.2 336 255.1C336 211.8 300.2 175.1 256 175.1C211.8 175.1 176 211.8 176 255.1C176 300.2 211.8 336 256 336z"/></svg>`,
    				tooltip: "설정",
    				onClick: /*func*/ ctx[7]
    			},
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block, create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$YT_VIDEO_ID*/ ctx[5] != "") return 0;
    		if (/*$LOCAL_SONG_PATH*/ ctx[6] != "") return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block3 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	nowplaying = new NowPlaying({ $$inline: true });

    	btn1 = new Btn({
    			props: {
    				defaultLabel: `<svg style="position: relative; top: .1em; width: 1em; height: 1em; margin-right: .2em; fill: white;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg> YouTube 음원 추가`,
    				minLabel: `<svg style="position: relative; top: .1em; width: 1em; height: 1em; margin-right: .2em; fill: white;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg> 추가`,
    				tooltip: "유튜브 음원 추가",
    				onClick: /*func_1*/ ctx[8]
    			},
    			$$inline: true
    		});

    	btn2 = new Btn({
    			props: {
    				defaultLabel: `<svg style="position: relative; top: .1em; width: 1em; height: 1em; margin-right: .2em; fill: white;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M224 128L224 0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 0 48-21.49 48-48V160h-127.1C238.3 160 224 145.7 224 128zM176 404c0 10.75-12.88 15.98-20.5 8.484L120 376H76C69.38 376 64 370.6 64 364v-56C64 301.4 69.38 296 76 296H120l35.5-36.5C163.1 251.9 176 257.3 176 268V404zM224 387.8c-4.391 0-8.75-1.835-11.91-5.367c-5.906-6.594-5.359-16.69 1.219-22.59C220.2 353.7 224 345.2 224 336s-3.797-17.69-10.69-23.88c-6.578-5.906-7.125-16-1.219-22.59c5.922-6.594 16.05-7.094 22.59-1.219C248.2 300.5 256 317.8 256 336s-7.766 35.53-21.31 47.69C231.6 386.4 227.8 387.8 224 387.8zM320 336c0 41.81-20.5 81.11-54.84 105.1c-2.781 1.938-5.988 2.875-9.145 2.875c-5.047 0-10.03-2.375-13.14-6.844c-5.047-7.25-3.281-17.22 3.969-22.28C272.6 396.9 288 367.4 288 336s-15.38-60.84-41.14-78.8c-7.25-5.062-9.027-15.03-3.98-22.28c5.047-7.281 14.99-9.062 22.27-3.969C299.5 254.9 320 294.2 320 336zM256 0v128h128L256 0z"/></svg> 로컬 음원파일 추가`,
    				minLabel: `<svg style="position: relative; top: .1em; width: 1em; height: 1em; margin-right: .2em; fill: white;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M224 128L224 0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 0 48-21.49 48-48V160h-127.1C238.3 160 224 145.7 224 128zM176 404c0 10.75-12.88 15.98-20.5 8.484L120 376H76C69.38 376 64 370.6 64 364v-56C64 301.4 69.38 296 76 296H120l35.5-36.5C163.1 251.9 176 257.3 176 268V404zM224 387.8c-4.391 0-8.75-1.835-11.91-5.367c-5.906-6.594-5.359-16.69 1.219-22.59C220.2 353.7 224 345.2 224 336s-3.797-17.69-10.69-23.88c-6.578-5.906-7.125-16-1.219-22.59c5.922-6.594 16.05-7.094 22.59-1.219C248.2 300.5 256 317.8 256 336s-7.766 35.53-21.31 47.69C231.6 386.4 227.8 387.8 224 387.8zM320 336c0 41.81-20.5 81.11-54.84 105.1c-2.781 1.938-5.988 2.875-9.145 2.875c-5.047 0-10.03-2.375-13.14-6.844c-5.047-7.25-3.281-17.22 3.969-22.28C272.6 396.9 288 367.4 288 336s-15.38-60.84-41.14-78.8c-7.25-5.062-9.027-15.03-3.98-22.28c5.047-7.281 14.99-9.062 22.27-3.969C299.5 254.9 320 294.2 320 336zM256 0v128h128L256 0z"/></svg> 추가`,
    				tooltip: "로컬 음원파일 추가",
    				onClick: /*func_2*/ ctx[9]
    			},
    			$$inline: true
    		});

    	btn3 = new Btn({
    			props: {
    				defaultLabel: `<svg style="position: relative; top: .1em; width: 1em; height: 1em; margin-right: .2em; fill: white;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C201.7 512 151.2 495 109.7 466.1C95.2 455.1 91.64 436 101.8 421.5C111.9 407 131.8 403.5 146.3 413.6C177.4 435.3 215.2 448 256 448C362 448 448 362 448 256C448 149.1 362 64 256 64C202.1 64 155 85.46 120.2 120.2L151 151C166.1 166.1 155.4 192 134.1 192H24C10.75 192 0 181.3 0 168V57.94C0 36.56 25.85 25.85 40.97 40.97L74.98 74.98C121.3 28.69 185.3 0 255.1 0L256 0zM256 128C269.3 128 280 138.7 280 152V246.1L344.1 311C354.3 320.4 354.3 335.6 344.1 344.1C335.6 354.3 320.4 354.3 311 344.1L239 272.1C234.5 268.5 232 262.4 232 256V152C232 138.7 242.7 128 256 128V128z"/></svg> 히스토리`,
    				minLabel: `<svg style="position: relative; top: .1em; width: 1em; height: 1em; fill: white;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C201.7 512 151.2 495 109.7 466.1C95.2 455.1 91.64 436 101.8 421.5C111.9 407 131.8 403.5 146.3 413.6C177.4 435.3 215.2 448 256 448C362 448 448 362 448 256C448 149.1 362 64 256 64C202.1 64 155 85.46 120.2 120.2L151 151C166.1 166.1 155.4 192 134.1 192H24C10.75 192 0 181.3 0 168V57.94C0 36.56 25.85 25.85 40.97 40.97L74.98 74.98C121.3 28.69 185.3 0 255.1 0L256 0zM256 128C269.3 128 280 138.7 280 152V246.1L344.1 311C354.3 320.4 354.3 335.6 344.1 344.1C335.6 354.3 320.4 354.3 311 344.1L239 272.1C234.5 268.5 232 262.4 232 256V152C232 138.7 242.7 128 256 128V128z"/></svg>`,
    				tooltip: "히스토리",
    				onClick: /*func_3*/ ctx[10]
    			},
    			$$inline: true
    		});

    	playlisttable = new PlayListTable({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(toastcontainer.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			t3 = space();
    			create_component(historylist.$$.fragment);
    			t4 = space();
    			div2 = element("div");
    			div0 = element("div");
    			t5 = space();
    			h1 = element("h1");
    			h1.textContent = "STREAM-MUSIC";
    			t7 = space();
    			div1 = element("div");
    			span2 = element("span");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t8 = space();
    			span0 = element("span");
    			span0.textContent = "네트워크 연결상태";
    			t10 = space();
    			span1 = element("span");
    			create_component(indicator0.$$.fragment);
    			t11 = space();
    			span5 = element("span");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t12 = space();
    			span3 = element("span");
    			span3.textContent = "STREAM-MUSIC 클라이언트 연결상태";
    			t14 = space();
    			span4 = element("span");
    			create_component(indicator1.$$.fragment);
    			t15 = space();
    			div16 = element("div");
    			div5 = element("div");
    			create_component(songcontrol.$$.fragment);
    			t16 = space();
    			div4 = element("div");
    			div3 = element("div");
    			create_component(btn0.$$.fragment);
    			t17 = space();
    			div15 = element("div");
    			div9 = element("div");
    			div6 = element("div");
    			if_block3.c();
    			t18 = space();
    			div8 = element("div");
    			div7 = element("div");
    			div7.textContent = "Now Playing";
    			t20 = space();
    			create_component(nowplaying.$$.fragment);
    			t21 = space();
    			div14 = element("div");
    			div12 = element("div");
    			div10 = element("div");
    			div10.textContent = "PlayList";
    			t23 = space();
    			div11 = element("div");
    			create_component(btn1.$$.fragment);
    			t24 = space();
    			create_component(btn2.$$.fragment);
    			t25 = space();
    			create_component(btn3.$$.fragment);
    			t26 = space();
    			table = element("table");
    			colgroup = element("colgroup");
    			col0 = element("col");
    			t27 = space();
    			col1 = element("col");
    			t28 = space();
    			col2 = element("col");
    			t29 = space();
    			col3 = element("col");
    			t30 = space();
    			col4 = element("col");
    			t31 = space();
    			col5 = element("col");
    			t32 = space();
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "NO";
    			t34 = space();
    			th1 = element("th");
    			th1.textContent = "TITLE";
    			t36 = space();
    			th2 = element("th");
    			th2.textContent = "ARTIST";
    			t38 = space();
    			th3 = element("th");
    			th3.textContent = "PLATFORM";
    			t40 = space();
    			th4 = element("th");
    			th4.textContent = "DURATION";
    			t42 = space();
    			th5 = element("th");
    			th5.textContent = "ACTIONS";
    			t44 = space();
    			div13 = element("div");
    			create_component(playlisttable.$$.fragment);
    			attr_dev(div0, "class", "bg svelte-1csrg2k");
    			add_location(div0, file, 35, 4, 1215);
    			attr_dev(h1, "class", "svelte-1csrg2k");
    			add_location(h1, file, 36, 4, 1238);
    			attr_dev(path0, "d", "M319.1 351.1c-35.35 0-64 28.66-64 64.01s28.66 64.01 64 64.01c35.34 0 64-28.66 64-64.01S355.3 351.1 319.1 351.1zM320 191.1c-70.25 0-137.9 25.6-190.5 72.03C116.3 275.7 115 295.9 126.7 309.2C138.5 322.4 158.7 323.7 171.9 312C212.8 275.9 265.4 256 320 256s107.3 19.88 148.1 56C474.2 317.4 481.8 320 489.3 320c8.844 0 17.66-3.656 24-10.81C525 295.9 523.8 275.7 510.5 264C457.9 217.6 390.3 191.1 320 191.1zM630.2 156.7C546.3 76.28 436.2 32 320 32S93.69 76.28 9.844 156.7c-12.75 12.25-13.16 32.5-.9375 45.25c12.22 12.78 32.47 13.12 45.25 .9375C125.1 133.1 220.4 96 320 96s193.1 37.97 265.8 106.9C592.1 208.8 600 211.8 608 211.8c8.406 0 16.81-3.281 23.09-9.844C643.3 189.2 642.9 168.1 630.2 156.7z");
    			add_location(path0, file, 43, 11, 1455);
    			attr_dev(svg0, "class", "icon");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 640 512");
    			add_location(svg0, file, 39, 8, 1339);
    			add_location(span0, file, 47, 8, 2203);
    			add_location(span1, file, 48, 8, 2234);
    			attr_dev(span2, "class", "indicator");
    			add_location(span2, file, 38, 6, 1306);
    			attr_dev(path1, "d", "M528 0h-480C21.5 0 0 21.5 0 48v320C0 394.5 21.5 416 48 416h192L224 464H152C138.8 464 128 474.8 128 488S138.8 512 152 512h272c13.25 0 24-10.75 24-24s-10.75-24-24-24H352L336 416h192c26.5 0 48-21.5 48-48v-320C576 21.5 554.5 0 528 0zM512 288H64V64h448V288z");
    			add_location(path1, file, 57, 11, 2479);
    			attr_dev(svg1, "class", "icon");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 576 512");
    			add_location(svg1, file, 53, 8, 2363);
    			add_location(span3, file, 61, 8, 2790);
    			add_location(span4, file, 62, 8, 2835);
    			attr_dev(span5, "class", "indicator");
    			add_location(span5, file, 52, 6, 2330);
    			attr_dev(div1, "class", "connection-indicators");
    			add_location(div1, file, 37, 4, 1264);
    			attr_dev(div2, "id", "main-header");
    			attr_dev(div2, "class", "svelte-1csrg2k");
    			add_location(div2, file, 34, 2, 1188);
    			attr_dev(div3, "class", "btns svelte-1csrg2k");
    			add_location(div3, file, 73, 8, 3062);
    			attr_dev(div4, "class", "btns svelte-1csrg2k");
    			add_location(div4, file, 72, 6, 3035);
    			attr_dev(div5, "class", "block controller svelte-1csrg2k");
    			add_location(div5, file, 70, 4, 2976);
    			attr_dev(div6, "class", "sub-block player-area svelte-1csrg2k");
    			add_location(div6, file, 88, 8, 6622);
    			attr_dev(div7, "class", "title svelte-1csrg2k");
    			add_location(div7, file, 105, 10, 7470);
    			attr_dev(div8, "class", "sub-block svelte-1csrg2k");
    			add_location(div8, file, 104, 8, 7436);
    			attr_dev(div9, "class", "block info-area svelte-1csrg2k");
    			attr_dev(div9, "id", "song-area");
    			add_location(div9, file, 87, 6, 6569);
    			attr_dev(div10, "class", "title svelte-1csrg2k");
    			add_location(div10, file, 111, 10, 7658);
    			attr_dev(div11, "class", "btns svelte-1csrg2k");
    			add_location(div11, file, 112, 10, 7702);
    			attr_dev(div12, "class", "title-area svelte-1csrg2k");
    			add_location(div12, file, 110, 8, 7623);
    			attr_dev(col0, "width", "40px");
    			add_location(col0, file, 141, 12, 13895);
    			attr_dev(col1, "width", "300px");
    			add_location(col1, file, 142, 12, 13928);
    			attr_dev(col2, "width", "150px");
    			add_location(col2, file, 143, 12, 13962);
    			attr_dev(col3, "width", "70px");
    			add_location(col3, file, 144, 12, 13996);
    			attr_dev(col4, "width", "70px");
    			add_location(col4, file, 145, 12, 14029);
    			attr_dev(col5, "width", "100px");
    			add_location(col5, file, 146, 12, 14062);
    			add_location(colgroup, file, 140, 10, 13872);
    			attr_dev(th0, "class", "svelte-1csrg2k");
    			add_location(th0, file, 150, 14, 14155);
    			attr_dev(th1, "class", "svelte-1csrg2k");
    			add_location(th1, file, 151, 14, 14181);
    			attr_dev(th2, "class", "svelte-1csrg2k");
    			add_location(th2, file, 152, 14, 14210);
    			attr_dev(th3, "class", "svelte-1csrg2k");
    			add_location(th3, file, 153, 14, 14240);
    			attr_dev(th4, "class", "svelte-1csrg2k");
    			add_location(th4, file, 154, 14, 14272);
    			attr_dev(th5, "class", "svelte-1csrg2k");
    			add_location(th5, file, 155, 14, 14304);
    			attr_dev(tr, "class", "svelte-1csrg2k");
    			add_location(tr, file, 149, 12, 14136);
    			add_location(thead, file, 148, 10, 14116);
    			attr_dev(table, "class", "playlist-table svelte-1csrg2k");
    			add_location(table, file, 139, 8, 13831);
    			attr_dev(div13, "class", "playlist-table-scrollbox svelte-1csrg2k");
    			add_location(div13, file, 159, 8, 14383);
    			attr_dev(div14, "class", "block info-area svelte-1csrg2k");
    			attr_dev(div14, "id", "playlist-area");
    			add_location(div14, file, 109, 6, 7566);
    			attr_dev(div15, "class", "infomation svelte-1csrg2k");
    			add_location(div15, file, 86, 4, 6538);
    			attr_dev(div16, "id", "main-viewport");
    			attr_dev(div16, "class", "svelte-1csrg2k");
    			add_location(div16, file, 69, 2, 2947);
    		},
    		m: function mount(target, anchor) {
    			mount_component(toastcontainer, target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(historylist, target, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t5);
    			append_dev(div2, h1);
    			append_dev(div2, t7);
    			append_dev(div2, div1);
    			append_dev(div1, span2);
    			append_dev(span2, svg0);
    			append_dev(svg0, path0);
    			append_dev(span2, t8);
    			append_dev(span2, span0);
    			append_dev(span2, t10);
    			append_dev(span2, span1);
    			mount_component(indicator0, span1, null);
    			append_dev(div1, t11);
    			append_dev(div1, span5);
    			append_dev(span5, svg1);
    			append_dev(svg1, path1);
    			append_dev(span5, t12);
    			append_dev(span5, span3);
    			append_dev(span5, t14);
    			append_dev(span5, span4);
    			mount_component(indicator1, span4, null);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, div16, anchor);
    			append_dev(div16, div5);
    			mount_component(songcontrol, div5, null);
    			append_dev(div5, t16);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			mount_component(btn0, div3, null);
    			append_dev(div16, t17);
    			append_dev(div16, div15);
    			append_dev(div15, div9);
    			append_dev(div9, div6);
    			if_blocks[current_block_type_index].m(div6, null);
    			append_dev(div9, t18);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div8, t20);
    			mount_component(nowplaying, div8, null);
    			append_dev(div15, t21);
    			append_dev(div15, div14);
    			append_dev(div14, div12);
    			append_dev(div12, div10);
    			append_dev(div12, t23);
    			append_dev(div12, div11);
    			mount_component(btn1, div11, null);
    			append_dev(div11, t24);
    			mount_component(btn2, div11, null);
    			append_dev(div11, t25);
    			mount_component(btn3, div11, null);
    			append_dev(div14, t26);
    			append_dev(div14, table);
    			append_dev(table, colgroup);
    			append_dev(colgroup, col0);
    			append_dev(colgroup, t27);
    			append_dev(colgroup, col1);
    			append_dev(colgroup, t28);
    			append_dev(colgroup, col2);
    			append_dev(colgroup, t29);
    			append_dev(colgroup, col3);
    			append_dev(colgroup, t30);
    			append_dev(colgroup, col4);
    			append_dev(colgroup, t31);
    			append_dev(colgroup, col5);
    			append_dev(table, t32);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t34);
    			append_dev(tr, th1);
    			append_dev(tr, t36);
    			append_dev(tr, th2);
    			append_dev(tr, t38);
    			append_dev(tr, th3);
    			append_dev(tr, t40);
    			append_dev(tr, th4);
    			append_dev(tr, t42);
    			append_dev(tr, th5);
    			append_dev(div14, t44);
    			append_dev(div14, div13);
    			mount_component(playlisttable, div13, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const toastcontainer_changes = {};

    			if (dirty & /*$$scope, data*/ 6144) {
    				toastcontainer_changes.$$scope = { dirty, ctx };
    			}

    			toastcontainer.$set(toastcontainer_changes);

    			if (/*$FLAG_LOADING_SCREEN_SAVER*/ ctx[0]) {
    				if (if_block0) {
    					if (dirty & /*$FLAG_LOADING_SCREEN_SAVER*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t1.parentNode, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*$FLAG_YT_SEARCH_POPUP*/ ctx[1]) {
    				if (if_block1) {
    					if (dirty & /*$FLAG_YT_SEARCH_POPUP*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t2.parentNode, t2);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*$FLAG_LOCAL_SEARCH_POPUP*/ ctx[2]) {
    				if (if_block2) {
    					if (dirty & /*$FLAG_LOCAL_SEARCH_POPUP*/ 4) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_2(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(t3.parentNode, t3);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			const indicator0_changes = {};
    			if (dirty & /*$FLAG_NETWORK_STATUS*/ 8) indicator0_changes.state = /*$FLAG_NETWORK_STATUS*/ ctx[3];
    			indicator0.$set(indicator0_changes);
    			const indicator1_changes = {};
    			if (dirty & /*$FLAG_CLIENT_STATUS*/ 16) indicator1_changes.state = /*$FLAG_CLIENT_STATUS*/ ctx[4];
    			indicator1.$set(indicator1_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block3 = if_blocks[current_block_type_index];

    				if (!if_block3) {
    					if_block3 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block3.c();
    				}

    				transition_in(if_block3, 1);
    				if_block3.m(div6, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toastcontainer.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(historylist.$$.fragment, local);
    			transition_in(indicator0.$$.fragment, local);
    			transition_in(indicator1.$$.fragment, local);
    			transition_in(songcontrol.$$.fragment, local);
    			transition_in(btn0.$$.fragment, local);
    			transition_in(if_block3);
    			transition_in(nowplaying.$$.fragment, local);
    			transition_in(btn1.$$.fragment, local);
    			transition_in(btn2.$$.fragment, local);
    			transition_in(btn3.$$.fragment, local);
    			transition_in(playlisttable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toastcontainer.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(historylist.$$.fragment, local);
    			transition_out(indicator0.$$.fragment, local);
    			transition_out(indicator1.$$.fragment, local);
    			transition_out(songcontrol.$$.fragment, local);
    			transition_out(btn0.$$.fragment, local);
    			transition_out(if_block3);
    			transition_out(nowplaying.$$.fragment, local);
    			transition_out(btn1.$$.fragment, local);
    			transition_out(btn2.$$.fragment, local);
    			transition_out(btn3.$$.fragment, local);
    			transition_out(playlisttable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(toastcontainer, detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(historylist, detaching);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div2);
    			destroy_component(indicator0);
    			destroy_component(indicator1);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(div16);
    			destroy_component(songcontrol);
    			destroy_component(btn0);
    			if_blocks[current_block_type_index].d();
    			destroy_component(nowplaying);
    			destroy_component(btn1);
    			destroy_component(btn2);
    			destroy_component(btn3);
    			destroy_component(playlisttable);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(18:0) <Protector>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let protector;
    	let current;

    	protector = new Protector({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(protector.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(protector, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const protector_changes = {};

    			if (dirty & /*$$scope, $YT_VIDEO_ID, $LOCAL_SONG_PATH, $FLAG_CLIENT_STATUS, $FLAG_NETWORK_STATUS, $FLAG_LOCAL_SEARCH_POPUP, $FLAG_YT_SEARCH_POPUP, $FLAG_LOADING_SCREEN_SAVER*/ 4223) {
    				protector_changes.$$scope = { dirty, ctx };
    			}

    			protector.$set(protector_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(protector.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(protector.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(protector, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $FLAG_LOADING_SCREEN_SAVER;
    	let $FLAG_YT_SEARCH_POPUP;
    	let $FLAG_LOCAL_SEARCH_POPUP;
    	let $FLAG_NETWORK_STATUS;
    	let $FLAG_CLIENT_STATUS;
    	let $YT_VIDEO_ID;
    	let $LOCAL_SONG_PATH;
    	validate_store(FLAG_LOADING_SCREEN_SAVER, 'FLAG_LOADING_SCREEN_SAVER');
    	component_subscribe($$self, FLAG_LOADING_SCREEN_SAVER, $$value => $$invalidate(0, $FLAG_LOADING_SCREEN_SAVER = $$value));
    	validate_store(FLAG_YT_SEARCH_POPUP, 'FLAG_YT_SEARCH_POPUP');
    	component_subscribe($$self, FLAG_YT_SEARCH_POPUP, $$value => $$invalidate(1, $FLAG_YT_SEARCH_POPUP = $$value));
    	validate_store(FLAG_LOCAL_SEARCH_POPUP, 'FLAG_LOCAL_SEARCH_POPUP');
    	component_subscribe($$self, FLAG_LOCAL_SEARCH_POPUP, $$value => $$invalidate(2, $FLAG_LOCAL_SEARCH_POPUP = $$value));
    	validate_store(FLAG_NETWORK_STATUS, 'FLAG_NETWORK_STATUS');
    	component_subscribe($$self, FLAG_NETWORK_STATUS, $$value => $$invalidate(3, $FLAG_NETWORK_STATUS = $$value));
    	validate_store(FLAG_CLIENT_STATUS, 'FLAG_CLIENT_STATUS');
    	component_subscribe($$self, FLAG_CLIENT_STATUS, $$value => $$invalidate(4, $FLAG_CLIENT_STATUS = $$value));
    	validate_store(YT_VIDEO_ID, 'YT_VIDEO_ID');
    	component_subscribe($$self, YT_VIDEO_ID, $$value => $$invalidate(5, $YT_VIDEO_ID = $$value));
    	validate_store(LOCAL_SONG_PATH, 'LOCAL_SONG_PATH');
    	component_subscribe($$self, LOCAL_SONG_PATH, $$value => $$invalidate(6, $LOCAL_SONG_PATH = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PlayerApp', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PlayerApp> was created with unknown prop '${key}'`);
    	});

    	const func = () => {
    		infoToast("현재 서비스 준비중입니다!");
    	};

    	const func_1 = () => {
    		FLAG_YT_SEARCH_POPUP.set(true);
    	};

    	const func_2 = () => {
    		FLAG_LOCAL_SEARCH_POPUP.set(true);
    	};

    	const func_3 = () => {
    		FLAG_HISTORY_LIST.set(true);
    	};

    	$$self.$capture_state = () => ({
    		ToastContainer,
    		FlatToast,
    		LoadingScreenSaver,
    		Btn,
    		Indicator,
    		Protector,
    		SongControl,
    		PlayListTable,
    		HistoryList,
    		NowPlaying,
    		YtSearch: YTSearch,
    		YtPlayer: YTPlayer,
    		LocalSearch,
    		infoToast,
    		FLAG_YT_SEARCH_POPUP,
    		FLAG_LOADING_SCREEN_SAVER,
    		FLAG_HISTORY_LIST,
    		FLAG_NETWORK_STATUS,
    		FLAG_CLIENT_STATUS,
    		FLAG_LOCAL_SEARCH_POPUP,
    		YT_VIDEO_ID,
    		LOCAL_SONG_PATH,
    		$FLAG_LOADING_SCREEN_SAVER,
    		$FLAG_YT_SEARCH_POPUP,
    		$FLAG_LOCAL_SEARCH_POPUP,
    		$FLAG_NETWORK_STATUS,
    		$FLAG_CLIENT_STATUS,
    		$YT_VIDEO_ID,
    		$LOCAL_SONG_PATH
    	});

    	return [
    		$FLAG_LOADING_SCREEN_SAVER,
    		$FLAG_YT_SEARCH_POPUP,
    		$FLAG_LOCAL_SEARCH_POPUP,
    		$FLAG_NETWORK_STATUS,
    		$FLAG_CLIENT_STATUS,
    		$YT_VIDEO_ID,
    		$LOCAL_SONG_PATH,
    		func,
    		func_1,
    		func_2,
    		func_3
    	];
    }

    class PlayerApp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlayerApp",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.48.0 */

    function create_fragment(ctx) {
    	let playerapp;
    	let current;
    	playerapp = new PlayerApp({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(playerapp.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(playerapp, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(playerapp.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(playerapp.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(playerapp, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ PlayerApp });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const localStoragePlayList = localStorage.getItem("streamMusicPlayList");
    if (localStoragePlayList !== null)
        PLAYLIST.set(JSON.parse(decodeURIComponent(escape(window.atob(localStoragePlayList)))));
    const localStoragePlayerVolume = localStorage.getItem("playerVolume");
    if (localStoragePlayerVolume !== null)
        PLAYER_VOLUME.set(parseInt(localStoragePlayerVolume));
    else {
        localStorage.setItem("playerVolume", String(50));
        PLAYER_VOLUME.set(50);
    }
    const cs = get_store_value(PLAYLIST).currentSong;
    if (cs !== null) {
        switch (cs.type) {
            case "youtube":
                YT_VIDEO_ID.set(cs.songId);
                break;
            case "local":
                LOCAL_SONG_PATH.set(cs.songId);
                break;
        }
    }
    const app = new App({
        target: document.body,
        props: {},
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
