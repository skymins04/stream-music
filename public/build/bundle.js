
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

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
    const file$f = "node_modules/svelte-toasts/src/ToastContainer.svelte";

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

    const get_default_slot_changes = dirty => ({ data: dirty & /*$toasts*/ 4 });
    const get_default_slot_context = ctx => ({ data: /*toast*/ ctx[14] });

    // (107:10) {:else}
    function create_else_block$7(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context);

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
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, get_default_slot_changes),
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
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(107:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (105:10) {#if toast.component}
    function create_if_block$8(ctx) {
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
    		id: create_if_block$8.name,
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
    	const if_block_creators = [create_if_block$8, create_else_block$7];
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
    			add_location(li, file$f, 99, 8, 2256);
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
    			add_location(ul, file$f, 95, 4, 2131);
    			attr_dev(div, "class", "toast-container " + /*placement*/ ctx[1] + " svelte-1rg6zyw");
    			set_style(div, "width", /*width*/ ctx[0]);
    			add_location(div, file$f, 94, 2, 2062);
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

    function create_fragment$h(ctx) {
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
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
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
    			id: create_fragment$h.name
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
    const file$e = "node_modules/svelte-toasts/src/FlatToast.svelte";
    const get_close_icon_slot_changes = dirty => ({});
    const get_close_icon_slot_context = ctx => ({});
    const get_extra_slot_changes = dirty => ({});
    const get_extra_slot_context = ctx => ({});
    const get_icon_slot_changes = dirty => ({});
    const get_icon_slot_context = ctx => ({});

    // (92:4) {:else}
    function create_else_block$6(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M9.2,5h1.5v7H9.2V5z M10,16c-0.6,0-1-0.4-1-1s0.4-1,1-1\ts1,0.4,1,1S10.6,16,10,16z");
    			add_location(path0, file$e, 99, 9, 2534);
    			attr_dev(path1, "d", "M9.2,5h1.5v7H9.2V5z M10,16c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S10.6,16,10,16z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$e, 101, 10, 2690);
    			attr_dev(svg, "class", "st-toast-icon svelte-is9c7e");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$e, 92, 6, 2353);
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
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(92:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (76:36) 
    function create_if_block_4(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z");
    			add_location(path0, file$e, 83, 9, 2085);
    			attr_dev(path1, "d", "M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$e, 85, 10, 2196);
    			attr_dev(svg, "class", "st-toast-icon svelte-is9c7e");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$e, 76, 6, 1904);
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
    		id: create_if_block_4.name,
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
    			add_location(path, file$e, 71, 9, 1681);
    			attr_dev(svg, "class", "st-toast-icon svelte-is9c7e");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 32 32");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$e, 64, 6, 1500);
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
    			add_location(path0, file$e, 53, 8, 1135);
    			attr_dev(path1, "fill", "none");
    			attr_dev(path1, "d", "M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$e, 56, 8, 1279);
    			attr_dev(svg, "class", "st-toast-icon svelte-is9c7e");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$e, 45, 6, 947);
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
    		if (/*data*/ ctx[1].type === 'error') return create_if_block_4;
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
    			add_location(h3, file$e, 112, 6, 2954);
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
    			add_location(path, file$e, 135, 8, 3504);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "bx--toast-notification__close-icon svelte-is9c7e");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 32 32");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$e, 127, 6, 3295);
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
    function create_if_block$7(ctx) {
    	let progress_1;

    	const block = {
    		c: function create() {
    			progress_1 = element("progress");
    			set_style(progress_1, "height", /*data*/ ctx[1].duration > 0 ? '4px' : 0);
    			progress_1.value = /*$progress*/ ctx[2];
    			attr_dev(progress_1, "class", "svelte-is9c7e");
    			add_location(progress_1, file$e, 142, 4, 3699);
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
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(142:2) {#if data.showProgress}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
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
    	let if_block1 = /*data*/ ctx[1].showProgress && create_if_block$7(ctx);

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
    			add_location(p, file$e, 115, 4, 3014);
    			attr_dev(div0, "class", "st-toast-extra");
    			add_location(div0, file$e, 116, 4, 3073);
    			attr_dev(div1, "class", "st-toast-details svelte-is9c7e");
    			add_location(div1, file$e, 110, 2, 2896);
    			attr_dev(button, "class", "st-toast-close-btn svelte-is9c7e");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "aria-label", "close");
    			add_location(button, file$e, 120, 2, 3152);
    			attr_dev(div2, "class", div2_class_value = "st-toast flat " + (/*data*/ ctx[1].theme || /*theme*/ ctx[0]) + " " + (/*data*/ ctx[1].type || 'info') + " svelte-is9c7e");
    			attr_dev(div2, "role", "alert");
    			attr_dev(div2, "aria-live", "assertive");
    			attr_dev(div2, "aria-atomic", "true");
    			add_location(div2, file$e, 36, 0, 730);
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
    					if_block1 = create_if_block$7(ctx);
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
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { theme: 0, data: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FlatToast",
    			options,
    			id: create_fragment$g.name
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
    const FLAG_LOADING_SCREEN_SAVER = writable(false); // 로딩 스크린 세이버 플래그
    const FLAG_PLAYING = writable(false); // 재생 여부 플래그
    const FLAG_PLAYER_IS_READY = writable(false); // YouTube iframe의 Video on ready 여부 플래그
    const FLAG_PLAYER_IS_BUFFERING = writable(false); // YouTube iframe의 Video on buffering 여부 플래그
    const FLAG_NEXT_SONG_LOADING = writable(false); // 재생 대기열 내의 다음곡을 로딩중인지 여부 플래그
    const FLAG_HISTORY_LIST = writable(false); // History List 토글 플래그
    const FLAG_NETWORK_STATUS = writable(false); // 네트워크 연결 상태 플래그
    const FLAG_CLIENT_STATUS = writable(false); // STREAM-MUSIC 클라이언트 연결 상태 플래그
    const FLAG_PROTECTOR = writable(false); // 서비스 보호화면 활성화 플래그
    const FLAG_ON_CHANGE_VOLUME = writable(false); // Player Volume 조절 중인 여부 플래그
    const FLAG_ON_CHANGE_CURRENT_TIME = writable(false); // Player currentTime 조절 중인 여부 플래그
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
    const file$d = "src/components/common/LoadingScreenSaver.svelte";

    function create_fragment$f(ctx) {
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
    			add_location(span, file$d, 5, 4, 133);
    			attr_dev(img, "class", "loading-icon svelte-1a23iik");
    			if (!src_url_equal(img.src, img_src_value = "img/loading-icon.gif")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$d, 6, 4, 190);
    			attr_dev(div0, "class", "dialog svelte-1a23iik");
    			add_location(div0, file$d, 4, 2, 108);
    			attr_dev(div1, "id", "screen-saver");
    			attr_dev(div1, "class", "svelte-1a23iik");
    			add_location(div1, file$d, 3, 0, 82);
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
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoadingScreenSaver",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/components/common/Btn.svelte generated by Svelte v3.48.0 */

    const file$c = "src/components/common/Btn.svelte";

    function create_fragment$e(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "btn svelte-7qyndy");
    			add_location(div, file$c, 4, 0, 67);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			div.innerHTML = /*label*/ ctx[0];

    			if (!mounted) {
    				dispose = listen_dev(
    					div,
    					"click",
    					function () {
    						if (is_function(/*onClick*/ ctx[1])) /*onClick*/ ctx[1].apply(this, arguments);
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
    			if (dirty & /*label*/ 1) div.innerHTML = /*label*/ ctx[0];		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Btn', slots, []);
    	let { label } = $$props;
    	let { onClick } = $$props;
    	const writable_props = ['label', 'onClick'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Btn> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('onClick' in $$props) $$invalidate(1, onClick = $$props.onClick);
    	};

    	$$self.$capture_state = () => ({ label, onClick });

    	$$self.$inject_state = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('onClick' in $$props) $$invalidate(1, onClick = $$props.onClick);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [label, onClick];
    }

    class Btn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { label: 0, onClick: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Btn",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*label*/ ctx[0] === undefined && !('label' in props)) {
    			console.warn("<Btn> was created without expected prop 'label'");
    		}

    		if (/*onClick*/ ctx[1] === undefined && !('onClick' in props)) {
    			console.warn("<Btn> was created without expected prop 'onClick'");
    		}
    	}

    	get label() {
    		throw new Error("<Btn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
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

    const file$b = "src/components/common/Indicator.svelte";

    function create_fragment$d(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "indicator svelte-1simiog");
    			toggle_class(div, "green", /*state*/ ctx[0]);
    			toggle_class(div, "red", !/*state*/ ctx[0]);
    			add_location(div, file$b, 3, 0, 47);
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
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { state: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Indicator",
    			options,
    			id: create_fragment$d.name
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
    const file$a = "src/components/common/Protector.svelte";

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
    			attr_dev(div0, "class", "block svelte-10twiiy");
    			add_location(div0, file$a, 6, 4, 217);
    			attr_dev(div1, "class", "protector svelte-10twiiy");
    			add_location(div1, file$a, 4, 2, 158);
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

    function create_fragment$c(ctx) {
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
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Protector",
    			options,
    			id: create_fragment$c.name
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
        savePlayList();
    };
    /**
     * 재생대기열의 첫번째 노래를 재생하는 함수
     * @param pause 재생상태 여부, true: 재생, false: 일시정지
     */
    const playSong = (pause) => {
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
        }
        else {
            // 현재 재생중인 노래가 있는 경우
            switch (currentSong.type) {
                case "youtube":
                    const interval = setInterval(() => {
                        if (get_store_value(FLAG_PLAYER_IS_READY)) {
                            get_store_value(PLAYER_ELEMENT).setVolume(get_store_value(PLAYER_VOLUME));
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

    const file$9 = "src/components/common/Slider.svelte";

    function create_fragment$b(ctx) {
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
    			add_location(input, file$9, 15, 0, 332);
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
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { min: 1, max: 2, value: 0, option: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Slider",
    			options,
    			id: create_fragment$b.name
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
    const file$8 = "src/components/PlayerApp/SongControl.svelte";

    // (86:4) {:else}
    function create_else_block$4(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM224 191.1v128C224 337.7 209.7 352 192 352S160 337.7 160 320V191.1C160 174.3 174.3 160 191.1 160S224 174.3 224 191.1zM352 191.1v128C352 337.7 337.7 352 320 352S288 337.7 288 320V191.1C288 174.3 302.3 160 319.1 160S352 174.3 352 191.1z");
    			add_location(path, file$8, 90, 9, 2980);
    			attr_dev(svg, "class", "icon pause svelte-1shfip3");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file$8, 86, 6, 2866);
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
    		source: "(86:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (77:4) {#if !$FLAG_PLAYING}
    function create_if_block$5(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM176 168V344C176 352.7 180.7 360.7 188.3 364.9C195.8 369.2 205.1 369 212.5 364.5L356.5 276.5C363.6 272.1 368 264.4 368 256C368 247.6 363.6 239.9 356.5 235.5L212.5 147.5C205.1 142.1 195.8 142.8 188.3 147.1C180.7 151.3 176 159.3 176 168V168z");
    			add_location(path, file$8, 81, 9, 2455);
    			attr_dev(svg, "class", "icon play svelte-1shfip3");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file$8, 77, 6, 2342);
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
    		source: "(77:4) {#if !$FLAG_PLAYING}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
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

    	if (/*$PLAYER_CURRENT_TIME*/ ctx[5] !== void 0) {
    		slider0_props.value = /*$PLAYER_CURRENT_TIME*/ ctx[5];
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

    	if (/*$PLAYER_VOLUME*/ ctx[4] !== void 0) {
    		slider1_props.value = /*$PLAYER_VOLUME*/ ctx[4];
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
    			t6 = text(/*$PLAYER_DURATION*/ ctx[8]);
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
    			t12 = text(/*$PLAYER_VOLUME*/ ctx[4]);
    			attr_dev(div0, "class", "song-control-btn svelte-1shfip3");
    			attr_dev(div0, "id", "play-btn");
    			add_location(div0, file$8, 75, 2, 2242);
    			attr_dev(path0, "d", "M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM352 328c0 13.2-10.8 24-24 24h-144C170.8 352 160 341.2 160 328v-144C160 170.8 170.8 160 184 160h144C341.2 160 352 170.8 352 184V328z");
    			add_location(path0, file$8, 101, 7, 3537);
    			attr_dev(svg0, "class", "icon stop svelte-1shfip3");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 512 512");
    			add_location(svg0, file$8, 97, 4, 3432);
    			attr_dev(div1, "class", "song-control-btn svelte-1shfip3");
    			attr_dev(div1, "id", "stop-btn");
    			add_location(div1, file$8, 96, 2, 3359);
    			attr_dev(path1, "d", "M287.1 447.1c17.67 0 31.1-14.33 31.1-32V96.03c0-17.67-14.33-32-32-32c-17.67 0-31.1 14.33-31.1 31.1v319.9C255.1 433.6 270.3 447.1 287.1 447.1zM52.51 440.6l192-159.1c7.625-6.436 11.43-15.53 11.43-24.62c0-9.094-3.809-18.18-11.43-24.62l-192-159.1C31.88 54.28 0 68.66 0 96.03v319.9C0 443.3 31.88 457.7 52.51 440.6z");
    			add_location(path1, file$8, 111, 7, 4003);
    			attr_dev(svg1, "class", "icon forward svelte-1shfip3");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 320 512");
    			add_location(svg1, file$8, 107, 4, 3895);
    			attr_dev(div2, "class", "song-control-btn svelte-1shfip3");
    			attr_dev(div2, "id", "forward-btn");
    			add_location(div2, file$8, 106, 2, 3816);
    			attr_dev(span0, "class", "text current-time svelte-1shfip3");
    			add_location(span0, file$8, 118, 6, 4425);
    			attr_dev(span1, "class", "text duration svelte-1shfip3");
    			add_location(span1, file$8, 148, 6, 5470);
    			attr_dev(div3, "class", "line svelte-1shfip3");
    			add_location(div3, file$8, 117, 4, 4400);
    			attr_dev(path2, "d", "M412.6 182c-10.28-8.334-25.41-6.867-33.75 3.402c-8.406 10.24-6.906 25.35 3.375 33.74C393.5 228.4 400 241.8 400 255.1c0 14.17-6.5 27.59-17.81 36.83c-10.28 8.396-11.78 23.5-3.375 33.74c4.719 5.806 11.62 8.802 18.56 8.802c5.344 0 10.75-1.779 15.19-5.399C435.1 311.5 448 284.6 448 255.1S435.1 200.4 412.6 182zM473.1 108.2c-10.22-8.334-25.34-6.898-33.78 3.34c-8.406 10.24-6.906 25.35 3.344 33.74C476.6 172.1 496 213.3 496 255.1s-19.44 82.1-53.31 110.7c-10.25 8.396-11.75 23.5-3.344 33.74c4.75 5.775 11.62 8.771 18.56 8.771c5.375 0 10.75-1.779 15.22-5.431C518.2 366.9 544 313 544 255.1S518.2 145 473.1 108.2zM534.4 33.4c-10.22-8.334-25.34-6.867-33.78 3.34c-8.406 10.24-6.906 25.35 3.344 33.74C559.9 116.3 592 183.9 592 255.1s-32.09 139.7-88.06 185.5c-10.25 8.396-11.75 23.5-3.344 33.74C505.3 481 512.2 484 519.2 484c5.375 0 10.75-1.779 15.22-5.431C601.5 423.6 640 342.5 640 255.1S601.5 88.34 534.4 33.4zM301.2 34.98c-11.5-5.181-25.01-3.076-34.43 5.29L131.8 160.1H48c-26.51 0-48 21.48-48 47.96v95.92c0 26.48 21.49 47.96 48 47.96h83.84l134.9 119.8C272.7 477 280.3 479.8 288 479.8c4.438 0 8.959-.9314 13.16-2.835C312.7 471.8 320 460.4 320 447.9V64.12C320 51.55 312.7 40.13 301.2 34.98z");
    			add_location(path2, file$8, 157, 9, 5755);
    			attr_dev(svg2, "class", "icon common volume-icon volume-high svelte-1shfip3");
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "viewBox", "0 0 640 512");
    			toggle_class(svg2, "display-block", /*$PLAYER_VOLUME*/ ctx[4] >= 65);
    			add_location(svg2, file$8, 152, 6, 5565);
    			attr_dev(path3, "d", "M412.6 181.9c-10.28-8.344-25.41-6.875-33.75 3.406c-8.406 10.25-6.906 25.37 3.375 33.78C393.5 228.4 400 241.8 400 256c0 14.19-6.5 27.62-17.81 36.87c-10.28 8.406-11.78 23.53-3.375 33.78c4.719 5.812 11.62 8.812 18.56 8.812c5.344 0 10.75-1.781 15.19-5.406C435.1 311.6 448 284.7 448 256S435.1 200.4 412.6 181.9zM301.2 34.84c-11.5-5.187-25.01-3.116-34.43 5.259L131.8 160H48c-26.51 0-48 21.49-48 47.1v95.1c0 26.51 21.49 47.1 48 47.1h83.84l134.9 119.9C272.7 477.2 280.3 480 288 480c4.438 0 8.959-.9313 13.16-2.837C312.7 472 320 460.6 320 448V64C320 51.41 312.7 39.1 301.2 34.84z");
    			add_location(path3, file$8, 166, 9, 7192);
    			attr_dev(svg3, "class", "icon common volume-icon volume-low svelte-1shfip3");
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg3, "viewBox", "0 0 448 512");
    			toggle_class(svg3, "display-block", /*$PLAYER_VOLUME*/ ctx[4] > 0 && /*$PLAYER_VOLUME*/ ctx[4] < 65);
    			add_location(svg3, file$8, 161, 6, 6982);
    			attr_dev(path4, "d", "M320 64v383.1c0 12.59-7.337 24.01-18.84 29.16C296.1 479.1 292.4 480 288 480c-7.688 0-15.28-2.781-21.27-8.094l-134.9-119.9H48c-26.51 0-48-21.49-48-47.1V208c0-26.51 21.49-47.1 48-47.1h83.84l134.9-119.9c9.422-8.375 22.93-10.45 34.43-5.259C312.7 39.1 320 51.41 320 64z");
    			add_location(path4, file$8, 175, 9, 8002);
    			attr_dev(svg4, "class", "icon common volume-icon volume-off svelte-1shfip3");
    			attr_dev(svg4, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg4, "viewBox", "0 0 320 512");
    			toggle_class(svg4, "display-block", /*$PLAYER_VOLUME*/ ctx[4] === 0);
    			add_location(svg4, file$8, 170, 6, 7813);
    			attr_dev(span2, "class", "text svelte-1shfip3");
    			add_location(span2, file$8, 191, 6, 8601);
    			attr_dev(div4, "class", "line svelte-1shfip3");
    			add_location(div4, file$8, 151, 4, 5540);
    			attr_dev(div5, "class", "song-control-slider svelte-1shfip3");
    			add_location(div5, file$8, 116, 2, 4362);
    			attr_dev(div6, "id", "song-control-interface");
    			attr_dev(div6, "class", "svelte-1shfip3");
    			add_location(div6, file$8, 74, 0, 2206);
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

    			if (dirty & /*$FLAG_PLAYING, $FLAG_PLAYER_IS_READY, $FLAG_PLAYER_IS_BUFFERING, $PLAYER_ELEMENT, $PLAYER_CURRENT_TIME*/ 236) slider0_changes.option = {
    				trackWidth: "100%",
    				onMouseDown: /*func*/ ctx[12],
    				onMouseUp: /*func_1*/ ctx[13]
    			};

    			if (!updating_value && dirty & /*$PLAYER_CURRENT_TIME*/ 32) {
    				updating_value = true;
    				slider0_changes.value = /*$PLAYER_CURRENT_TIME*/ ctx[5];
    				add_flush_callback(() => updating_value = false);
    			}

    			if (!updating_max && dirty & /*playerDurationNum*/ 1) {
    				updating_max = true;
    				slider0_changes.max = /*playerDurationNum*/ ctx[0];
    				add_flush_callback(() => updating_max = false);
    			}

    			slider0.$set(slider0_changes);
    			if (!current || dirty & /*$PLAYER_DURATION*/ 256) set_data_dev(t6, /*$PLAYER_DURATION*/ ctx[8]);

    			if (dirty & /*$PLAYER_VOLUME*/ 16) {
    				toggle_class(svg2, "display-block", /*$PLAYER_VOLUME*/ ctx[4] >= 65);
    			}

    			if (dirty & /*$PLAYER_VOLUME*/ 16) {
    				toggle_class(svg3, "display-block", /*$PLAYER_VOLUME*/ ctx[4] > 0 && /*$PLAYER_VOLUME*/ ctx[4] < 65);
    			}

    			if (dirty & /*$PLAYER_VOLUME*/ 16) {
    				toggle_class(svg4, "display-block", /*$PLAYER_VOLUME*/ ctx[4] === 0);
    			}

    			const slider1_changes = {};

    			if (!updating_value_1 && dirty & /*$PLAYER_VOLUME*/ 16) {
    				updating_value_1 = true;
    				slider1_changes.value = /*$PLAYER_VOLUME*/ ctx[4];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			slider1.$set(slider1_changes);
    			if (!current || dirty & /*$PLAYER_VOLUME*/ 16) set_data_dev(t12, /*$PLAYER_VOLUME*/ ctx[4]);
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
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $PLAYER_ELEMENT;
    	let $FLAG_ON_CHANGE_CURRENT_TIME;
    	let $FLAG_PLAYING;
    	let $PLAYER_VOLUME;
    	let $PLAYLIST;
    	let $PLAYER_CURRENT_TIME;
    	let $FLAG_PLAYER_IS_READY;
    	let $FLAG_PLAYER_IS_BUFFERING;
    	let $PLAYER_DURATION;
    	validate_store(PLAYER_ELEMENT, 'PLAYER_ELEMENT');
    	component_subscribe($$self, PLAYER_ELEMENT, $$value => $$invalidate(2, $PLAYER_ELEMENT = $$value));
    	validate_store(FLAG_ON_CHANGE_CURRENT_TIME, 'FLAG_ON_CHANGE_CURRENT_TIME');
    	component_subscribe($$self, FLAG_ON_CHANGE_CURRENT_TIME, $$value => $$invalidate(19, $FLAG_ON_CHANGE_CURRENT_TIME = $$value));
    	validate_store(FLAG_PLAYING, 'FLAG_PLAYING');
    	component_subscribe($$self, FLAG_PLAYING, $$value => $$invalidate(3, $FLAG_PLAYING = $$value));
    	validate_store(PLAYER_VOLUME, 'PLAYER_VOLUME');
    	component_subscribe($$self, PLAYER_VOLUME, $$value => $$invalidate(4, $PLAYER_VOLUME = $$value));
    	validate_store(PLAYLIST, 'PLAYLIST');
    	component_subscribe($$self, PLAYLIST, $$value => $$invalidate(20, $PLAYLIST = $$value));
    	validate_store(PLAYER_CURRENT_TIME, 'PLAYER_CURRENT_TIME');
    	component_subscribe($$self, PLAYER_CURRENT_TIME, $$value => $$invalidate(5, $PLAYER_CURRENT_TIME = $$value));
    	validate_store(FLAG_PLAYER_IS_READY, 'FLAG_PLAYER_IS_READY');
    	component_subscribe($$self, FLAG_PLAYER_IS_READY, $$value => $$invalidate(6, $FLAG_PLAYER_IS_READY = $$value));
    	validate_store(FLAG_PLAYER_IS_BUFFERING, 'FLAG_PLAYER_IS_BUFFERING');
    	component_subscribe($$self, FLAG_PLAYER_IS_BUFFERING, $$value => $$invalidate(7, $FLAG_PLAYER_IS_BUFFERING = $$value));
    	validate_store(PLAYER_DURATION, 'PLAYER_DURATION');
    	component_subscribe($$self, PLAYER_DURATION, $$value => $$invalidate(8, $PLAYER_DURATION = $$value));
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
    					$PLAYER_ELEMENT.setVolume($PLAYER_VOLUME);
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

    		if ($FLAG_PLAYING) {
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
    		$PLAYER_VOLUME,
    		$PLAYLIST,
    		$PLAYER_CURRENT_TIME,
    		$FLAG_PLAYER_IS_READY,
    		$FLAG_PLAYER_IS_BUFFERING,
    		$PLAYER_DURATION
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
    		$PLAYER_VOLUME,
    		$PLAYER_CURRENT_TIME,
    		$FLAG_PLAYER_IS_READY,
    		$FLAG_PLAYER_IS_BUFFERING,
    		$PLAYER_DURATION,
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
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SongControl",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/components/common/EmptyCover.svelte generated by Svelte v3.48.0 */

    const file$7 = "src/components/common/EmptyCover.svelte";

    function create_fragment$9(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "empty-cover svelte-tt3r1y");
    			set_style(div, "height", /*height*/ ctx[2]);
    			set_style(div, "color", /*color*/ ctx[1]);
    			add_location(div, file$7, 5, 0, 129);
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
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { msg: 0, color: 1, height: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EmptyCover",
    			options,
    			id: create_fragment$9.name
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
    const file$6 = "src/components/PlayerApp/WritableText.svelte";

    function create_fragment$8(ctx) {
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
    			add_location(path, file$6, 43, 7, 1126);
    			attr_dev(svg, "class", "write-icon svelte-1bv6jg2");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file$6, 39, 18, 1020);
    			attr_dev(span0, "class", "text svelte-1bv6jg2");
    			toggle_class(span0, "current-song", /*option*/ ctx[0].isCurrentSong);
    			toggle_class(span0, "display-none", /*writeMode*/ ctx[1]);
    			add_location(span0, file$6, 32, 2, 839);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "svelte-1bv6jg2");
    			add_location(input, file$6, 49, 4, 1761);
    			attr_dev(button, "class", "svelte-1bv6jg2");
    			add_location(button, file$6, 50, 4, 1815);
    			attr_dev(span1, "class", "write-area svelte-1bv6jg2");
    			toggle_class(span1, "display-none", !/*writeMode*/ ctx[1]);
    			add_location(span1, file$6, 48, 2, 1699);
    			attr_dev(div, "class", "writable-text svelte-1bv6jg2");
    			toggle_class(div, "current-song", /*option*/ ctx[0].isCurrentSong);
    			add_location(div, file$6, 31, 0, 767);
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
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { option: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WritableText",
    			options,
    			id: create_fragment$8.name
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
    const file$5 = "src/components/PlayerApp/PlayListTable.svelte";

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
    				msg: "플레이리스트에 대기 중인 곡이 없습니다.<br>YouTube 또는 로컬 음원파일(mp3, wav)을 추가해보세요!",
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
    			add_location(col0, file$5, 38, 6, 1148);
    			attr_dev(col1, "width", "300px");
    			add_location(col1, file$5, 39, 6, 1175);
    			attr_dev(col2, "width", "150px");
    			add_location(col2, file$5, 40, 6, 1203);
    			attr_dev(col3, "width", "70px");
    			add_location(col3, file$5, 41, 6, 1231);
    			attr_dev(col4, "width", "70px");
    			add_location(col4, file$5, 42, 6, 1258);
    			attr_dev(col5, "width", "100px");
    			add_location(col5, file$5, 43, 6, 1285);
    			add_location(colgroup, file$5, 37, 4, 1131);
    			add_location(tbody, file$5, 45, 4, 1327);
    			attr_dev(table, "class", "playlist-table svelte-16mtqrf");
    			add_location(table, file$5, 36, 2, 1096);
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
    			add_location(td0, file$5, 48, 10, 1399);
    			attr_dev(td1, "class", "svelte-16mtqrf");
    			add_location(td1, file$5, 49, 10, 1426);
    			attr_dev(td2, "class", "svelte-16mtqrf");
    			add_location(td2, file$5, 59, 10, 1667);
    			attr_dev(td3, "class", "svelte-16mtqrf");
    			add_location(td3, file$5, 69, 10, 1910);
    			attr_dev(td4, "class", "svelte-16mtqrf");
    			add_location(td4, file$5, 70, 10, 1941);
    			attr_dev(path0, "d", "M9.39 265.4l127.1-128C143.6 131.1 151.8 128 160 128s16.38 3.125 22.63 9.375l127.1 128c9.156 9.156 11.9 22.91 6.943 34.88S300.9 320 287.1 320H32.01c-12.94 0-24.62-7.781-29.58-19.75S.2333 274.5 9.39 265.4z");
    			add_location(path0, file$5, 82, 17, 2293);
    			attr_dev(svg0, "class", "icon svelte-16mtqrf");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 320 512");
    			add_location(svg0, file$5, 78, 14, 2153);
    			attr_dev(div0, "class", "song-setting-btn song-up svelte-16mtqrf");
    			add_location(div0, file$5, 72, 12, 1993);
    			attr_dev(path1, "d", "M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z");
    			add_location(path1, file$5, 97, 17, 2902);
    			attr_dev(svg1, "class", "icon svelte-16mtqrf");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 320 512");
    			add_location(svg1, file$5, 93, 14, 2762);
    			attr_dev(div1, "class", "song-setting-btn song-down svelte-16mtqrf");
    			add_location(div1, file$5, 87, 12, 2596);
    			attr_dev(path2, "d", "M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z");
    			add_location(path2, file$5, 112, 17, 3505);
    			attr_dev(svg2, "class", "icon svelte-16mtqrf");
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "viewBox", "0 0 320 512");
    			add_location(svg2, file$5, 108, 14, 3365);
    			attr_dev(div2, "class", "song-setting-btn song-del svelte-16mtqrf");
    			add_location(div2, file$5, 102, 12, 3207);
    			attr_dev(td5, "class", "svelte-16mtqrf");
    			add_location(td5, file$5, 71, 10, 1976);
    			attr_dev(tr, "class", "svelte-16mtqrf");
    			add_location(tr, file$5, 47, 8, 1384);
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

    function create_fragment$7(ctx) {
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
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlayListTable",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/components/PlayerApp/HistoryList.svelte generated by Svelte v3.48.0 */
    const file$4 = "src/components/PlayerApp/HistoryList.svelte";

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
    			attr_dev(div0, "class", "svelte-4fl89n");
    			add_location(div0, file$4, 20, 2, 678);
    			attr_dev(span, "class", "subtitle svelte-4fl89n");
    			add_location(span, file$4, 29, 15, 931);
    			attr_dev(div1, "class", "title svelte-4fl89n");
    			add_location(div1, file$4, 28, 6, 896);
    			attr_dev(div2, "class", "exit-btn svelte-4fl89n");
    			add_location(div2, file$4, 31, 6, 999);
    			attr_dev(div3, "class", "title-area svelte-4fl89n");
    			add_location(div3, file$4, 27, 4, 865);
    			attr_dev(div4, "class", "list svelte-4fl89n");
    			add_location(div4, file$4, 39, 4, 1131);
    			attr_dev(div5, "id", "history-list-area");
    			attr_dev(div5, "class", "svelte-4fl89n");
    			add_location(div5, file$4, 26, 2, 789);
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
    			attr_dev(path, "class", "svelte-4fl89n");
    			add_location(path, file$4, 71, 19, 3716);
    			attr_dev(svg, "class", "icon common svelte-4fl89n");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 384 512");
    			add_location(svg, file$4, 67, 16, 3561);
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
    			attr_dev(path0, "class", "svelte-4fl89n");
    			add_location(path0, file$4, 49, 19, 1513);
    			attr_dev(svg0, "class", "icon youtube svelte-4fl89n");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 576 512");
    			add_location(svg0, file$4, 45, 16, 1357);
    			attr_dev(path1, "d", "M172.5 131.1C228.1 75.51 320.5 75.51 376.1 131.1C426.1 181.1 433.5 260.8 392.4 318.3L391.3 319.9C381 334.2 361 337.6 346.7 327.3C332.3 317 328.9 297 339.2 282.7L340.3 281.1C363.2 249 359.6 205.1 331.7 177.2C300.3 145.8 249.2 145.8 217.7 177.2L105.5 289.5C73.99 320.1 73.99 372 105.5 403.5C133.3 431.4 177.3 435 209.3 412.1L210.9 410.1C225.3 400.7 245.3 404 255.5 418.4C265.8 432.8 262.5 452.8 248.1 463.1L246.5 464.2C188.1 505.3 110.2 498.7 60.21 448.8C3.741 392.3 3.741 300.7 60.21 244.3L172.5 131.1zM467.5 380C411 436.5 319.5 436.5 263 380C213 330 206.5 251.2 247.6 193.7L248.7 192.1C258.1 177.8 278.1 174.4 293.3 184.7C307.7 194.1 311.1 214.1 300.8 229.3L299.7 230.9C276.8 262.1 280.4 306.9 308.3 334.8C339.7 366.2 390.8 366.2 422.3 334.8L534.5 222.5C566 191 566 139.1 534.5 108.5C506.7 80.63 462.7 76.99 430.7 99.9L429.1 101C414.7 111.3 394.7 107.1 384.5 93.58C374.2 79.2 377.5 59.21 391.9 48.94L393.5 47.82C451 6.731 529.8 13.25 579.8 63.24C636.3 119.7 636.3 211.3 579.8 267.7L467.5 380z");
    			attr_dev(path1, "class", "svelte-4fl89n");
    			add_location(path1, file$4, 57, 19, 2229);
    			attr_dev(svg1, "class", "icon common svelte-4fl89n");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 640 512");
    			add_location(svg1, file$4, 53, 16, 2074);
    			attr_dev(a, "href", a_href_value = "https://www.youtube.com/watch?v=" + /*song*/ ctx[8].songId);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			attr_dev(a, "class", "svelte-4fl89n");
    			add_location(a, file$4, 61, 16, 3312);
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
    			attr_dev(div0, "class", "line svelte-4fl89n");
    			add_location(div0, file$4, 43, 12, 1278);
    			attr_dev(div1, "class", "line svelte-4fl89n");
    			add_location(div1, file$4, 78, 12, 4776);
    			attr_dev(div2, "class", "del-btn svelte-4fl89n");
    			add_location(div2, file$4, 79, 12, 4826);
    			attr_dev(div3, "class", "add-btn svelte-4fl89n");
    			add_location(div3, file$4, 85, 12, 4972);
    			attr_dev(div4, "class", "song svelte-4fl89n");
    			add_location(div4, file$4, 42, 10, 1247);
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

    function create_fragment$6(ctx) {
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
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HistoryList",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/components/PlayerApp/NowPlaying.svelte generated by Svelte v3.48.0 */
    const file$3 = "src/components/PlayerApp/NowPlaying.svelte";

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
    			add_location(span0, file$3, 8, 7, 274);
    			attr_dev(span1, "class", "line svelte-e3lyc");
    			add_location(span1, file$3, 7, 4, 248);
    			attr_dev(span2, "class", "subtitle svelte-e3lyc");
    			add_location(span2, file$3, 18, 6, 513);
    			attr_dev(span3, "class", "line svelte-e3lyc");
    			add_location(span3, file$3, 17, 4, 487);
    			attr_dev(span4, "class", "subtitle svelte-e3lyc");
    			add_location(span4, file$3, 28, 6, 755);
    			attr_dev(span5, "class", "bold");
    			add_location(span5, file$3, 29, 6, 803);
    			attr_dev(span6, "class", "line svelte-e3lyc");
    			add_location(span6, file$3, 27, 4, 729);
    			attr_dev(span7, "class", "subtitle svelte-e3lyc");
    			add_location(span7, file$3, 32, 6, 904);
    			attr_dev(span8, "class", "bold");
    			add_location(span8, file$3, 33, 6, 952);
    			attr_dev(span9, "class", "line svelte-e3lyc");
    			add_location(span9, file$3, 31, 4, 878);
    			attr_dev(div, "class", "current-song svelte-e3lyc");
    			add_location(div, file$3, 6, 2, 217);
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
    			add_location(path0, file$3, 44, 13, 1352);
    			attr_dev(svg0, "class", "icon youtube svelte-e3lyc");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 576 512");
    			add_location(svg0, file$3, 40, 11, 1220);
    			attr_dev(path1, "d", "M172.5 131.1C228.1 75.51 320.5 75.51 376.1 131.1C426.1 181.1 433.5 260.8 392.4 318.3L391.3 319.9C381 334.2 361 337.6 346.7 327.3C332.3 317 328.9 297 339.2 282.7L340.3 281.1C363.2 249 359.6 205.1 331.7 177.2C300.3 145.8 249.2 145.8 217.7 177.2L105.5 289.5C73.99 320.1 73.99 372 105.5 403.5C133.3 431.4 177.3 435 209.3 412.1L210.9 410.1C225.3 400.7 245.3 404 255.5 418.4C265.8 432.8 262.5 452.8 248.1 463.1L246.5 464.2C188.1 505.3 110.2 498.7 60.21 448.8C3.741 392.3 3.741 300.7 60.21 244.3L172.5 131.1zM467.5 380C411 436.5 319.5 436.5 263 380C213 330 206.5 251.2 247.6 193.7L248.7 192.1C258.1 177.8 278.1 174.4 293.3 184.7C307.7 194.1 311.1 214.1 300.8 229.3L299.7 230.9C276.8 262.1 280.4 306.9 308.3 334.8C339.7 366.2 390.8 366.2 422.3 334.8L534.5 222.5C566 191 566 139.1 534.5 108.5C506.7 80.63 462.7 76.99 430.7 99.9L429.1 101C414.7 111.3 394.7 107.1 384.5 93.58C374.2 79.2 377.5 59.21 391.9 48.94L393.5 47.82C451 6.731 529.8 13.25 579.8 63.24C636.3 119.7 636.3 211.3 579.8 267.7L467.5 380z");
    			add_location(path1, file$3, 51, 13, 2009);
    			attr_dev(svg1, "class", "icon common svelte-e3lyc");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 640 512");
    			add_location(svg1, file$3, 47, 11, 1878);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "href", a_href_value = "https://youtube.com/watch?v=" + /*$PLAYLIST*/ ctx[0].currentSong.songId);
    			add_location(a, file$3, 37, 8, 1104);
    			attr_dev(span, "class", "line svelte-e3lyc");
    			add_location(span, file$3, 36, 6, 1076);
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

    function create_fragment$5(ctx) {
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
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NowPlaying",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
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
    const file$2 = "node_modules/svelte-youtube/src/index.svelte";

    function create_fragment$4(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "id", /*id*/ ctx[0]);
    			add_location(div0, file$2, 143, 2, 4083);
    			attr_dev(div1, "class", /*className*/ ctx[1]);
    			add_location(div1, file$2, 142, 0, 4057);
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
    		id: create_fragment$4.name,
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

    function instance$4($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { id: 0, videoId: 3, options: 4, class: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Src",
    			options,
    			id: create_fragment$4.name
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

    /* src/components/PlayerApp/YTSearch.svelte generated by Svelte v3.48.0 */
    const file$1 = "src/components/PlayerApp/YTSearch.svelte";

    // (90:6) {#if ytSearchID !== ""}
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
    		source: "(90:6) {#if ytSearchID !== \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div6;
    	let div5;
    	let div0;
    	let t0;
    	let div3;
    	let div1;
    	let t2;
    	let div2;
    	let input;
    	let t3;
    	let button;
    	let t5;
    	let div4;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*ytSearchID*/ ctx[1] !== "" && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div5 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div3 = element("div");
    			div1 = element("div");
    			div1.textContent = "유튜브 주소로 추가";
    			t2 = space();
    			div2 = element("div");
    			input = element("input");
    			t3 = space();
    			button = element("button");
    			button.textContent = "추가";
    			t5 = space();
    			div4 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "exit-btn svelte-1tjomm8");
    			add_location(div0, file$1, 71, 4, 2325);
    			attr_dev(div1, "class", "viewport-title svelte-1tjomm8");
    			add_location(div1, file$1, 78, 6, 2473);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "ex) https://www.youtube.com/watch?v=-Y9VtoPvtuM");
    			attr_dev(input, "class", "svelte-1tjomm8");
    			add_location(input, file$1, 80, 8, 2556);
    			attr_dev(button, "class", "svelte-1tjomm8");
    			add_location(button, file$1, 85, 8, 2705);
    			attr_dev(div2, "class", "frm-input svelte-1tjomm8");
    			add_location(div2, file$1, 79, 6, 2524);
    			attr_dev(div3, "class", "interface link svelte-1tjomm8");
    			add_location(div3, file$1, 77, 4, 2438);
    			attr_dev(div4, "class", "displaynone svelte-1tjomm8");
    			add_location(div4, file$1, 88, 4, 2775);
    			attr_dev(div5, "class", "viewport svelte-1tjomm8");
    			add_location(div5, file$1, 70, 2, 2298);
    			attr_dev(div6, "id", "yt-search-popup");
    			attr_dev(div6, "class", "svelte-1tjomm8");
    			add_location(div6, file$1, 69, 0, 2269);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div5);
    			append_dev(div5, div0);
    			append_dev(div5, t0);
    			append_dev(div5, div3);
    			append_dev(div3, div1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, input);
    			set_input_value(input, /*ytURL*/ ctx[0]);
    			append_dev(div2, t3);
    			append_dev(div2, button);
    			append_dev(div5, t5);
    			append_dev(div5, div4);
    			if (if_block) if_block.m(div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[5], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[6]),
    					listen_dev(button, "click", /*addQueueYT*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
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
    					if_block.m(div4, null);
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
    			if (detaching) detach_dev(div6);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
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
    	validate_store(PLAYLIST, 'PLAYLIST');
    	component_subscribe($$self, PLAYLIST, $$value => $$invalidate(8, $PLAYLIST = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('YTSearch', slots, []);
    	let ytURL;
    	let ytSearchID = "";
    	let ytPlayer = null;

    	/**
     * 재생 대기열에 ytSearchID에 해당하는 YouTube 영상 정보를 추가하는 함수
     */
    	const addQueueYT = async () => {
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

    	const click_handler = () => {
    		FLAG_YT_SEARCH_POPUP.set(false);
    	};

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
    		ytURL,
    		ytSearchID,
    		ytPlayer,
    		addQueueYT,
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
    		addQueueYT,
    		onReadyYoutubePlayer,
    		onStateChangeYoutubePlayer,
    		click_handler,
    		input_input_handler
    	];
    }

    class YTSearch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "YTSearch",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/components/PlayerApp/YTPlayer.svelte generated by Svelte v3.48.0 */

    function create_fragment$2(ctx) {
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
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $PLAYLIST;
    	let $PLAYER_VOLUME;
    	let $PLAYER_ELEMENT;
    	let $FLAG_PLAYING;
    	let $FLAG_PLAYER_IS_BUFFERING;
    	let $FLAG_ON_CHANGE_CURRENT_TIME;
    	let $FLAG_ON_CHANGE_VOLUME;
    	let $YT_VIDEO_ID;
    	validate_store(PLAYLIST, 'PLAYLIST');
    	component_subscribe($$self, PLAYLIST, $$value => $$invalidate(3, $PLAYLIST = $$value));
    	validate_store(PLAYER_VOLUME, 'PLAYER_VOLUME');
    	component_subscribe($$self, PLAYER_VOLUME, $$value => $$invalidate(4, $PLAYER_VOLUME = $$value));
    	validate_store(PLAYER_ELEMENT, 'PLAYER_ELEMENT');
    	component_subscribe($$self, PLAYER_ELEMENT, $$value => $$invalidate(5, $PLAYER_ELEMENT = $$value));
    	validate_store(FLAG_PLAYING, 'FLAG_PLAYING');
    	component_subscribe($$self, FLAG_PLAYING, $$value => $$invalidate(6, $FLAG_PLAYING = $$value));
    	validate_store(FLAG_PLAYER_IS_BUFFERING, 'FLAG_PLAYER_IS_BUFFERING');
    	component_subscribe($$self, FLAG_PLAYER_IS_BUFFERING, $$value => $$invalidate(7, $FLAG_PLAYER_IS_BUFFERING = $$value));
    	validate_store(FLAG_ON_CHANGE_CURRENT_TIME, 'FLAG_ON_CHANGE_CURRENT_TIME');
    	component_subscribe($$self, FLAG_ON_CHANGE_CURRENT_TIME, $$value => $$invalidate(8, $FLAG_ON_CHANGE_CURRENT_TIME = $$value));
    	validate_store(FLAG_ON_CHANGE_VOLUME, 'FLAG_ON_CHANGE_VOLUME');
    	component_subscribe($$self, FLAG_ON_CHANGE_VOLUME, $$value => $$invalidate(9, $FLAG_ON_CHANGE_VOLUME = $$value));
    	validate_store(YT_VIDEO_ID, 'YT_VIDEO_ID');
    	component_subscribe($$self, YT_VIDEO_ID, $$value => $$invalidate(0, $YT_VIDEO_ID = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('YTPlayer', slots, []);

    	setInterval(
    		() => {
    			if ($FLAG_PLAYING && !$FLAG_ON_CHANGE_VOLUME && !$FLAG_PLAYER_IS_BUFFERING && $PLAYER_ELEMENT.getVolume) {
    				PLAYER_VOLUME.set($PLAYER_ELEMENT.getVolume());
    			}

    			if ($FLAG_PLAYING && !$FLAG_ON_CHANGE_CURRENT_TIME && !$FLAG_PLAYER_IS_BUFFERING && $PLAYER_ELEMENT.getCurrentTime) {
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
    			FLAG_PLAYER_IS_READY.set(false);

    			PLAYER_DURATION.set("00:00");
    			FLAG_PLAYER_IS_BUFFERING.set(false);
    			$PLAYER_ELEMENT.setVolume($PLAYER_VOLUME);
    		} else if (event.detail.data === 0) {
    			// end video
    			fowardSong($FLAG_PLAYING);

    			FLAG_PLAYER_IS_READY.set(false);
    			PLAYER_DURATION.set("00:00");
    			FLAG_PLAYER_IS_BUFFERING.set(false);
    		} else if (event.detail.data === 1) {
    			// is playing
    			FLAG_PLAYING.set(true);

    			FLAG_PLAYER_IS_READY.set(true);
    			FLAG_PLAYER_IS_BUFFERING.set(false);
    			$PLAYER_ELEMENT.setVolume($PLAYER_VOLUME);

    			const duration = (_a = $PLAYLIST.currentSong) === null || _a === void 0
    			? void 0
    			: _a.duration;

    			if (duration) PLAYER_DURATION.set(duration);
    		} else if (event.detail.data === 2) {
    			// paused
    			FLAG_PLAYING.set(false);

    			$PLAYER_ELEMENT.setVolume($PLAYER_VOLUME);
    		} else if (event.detail.data === 3) {
    			// buffering
    			FLAG_PLAYER_IS_BUFFERING.set(true);
    		} else if (event.detail.data === 5) {
    			// video on ready
    			if ($FLAG_PLAYING) {
    				$PLAYER_ELEMENT.playVideo();
    			}

    			$PLAYER_ELEMENT.setVolume($PLAYER_VOLUME);

    			const duration = (_b = $PLAYLIST.currentSong) === null || _b === void 0
    			? void 0
    			: _b.duration;

    			if (duration) PLAYER_DURATION.set(duration);
    			FLAG_PLAYER_IS_READY.set(true);
    			FLAG_NEXT_SONG_LOADING.set(false);
    			FLAG_PLAYER_IS_BUFFERING.set(false);
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
    		fowardSong,
    		onReadyYoutubePlayer,
    		onStateChangeYoutubePlayer,
    		$PLAYLIST,
    		$PLAYER_VOLUME,
    		$PLAYER_ELEMENT,
    		$FLAG_PLAYING,
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
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "YTPlayer",
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

    const { console: console_1 } = globals;
    const file = "src/components/PlayerApp/index.svelte";

    // (18:2) <ToastContainer let:data>
    function create_default_slot_1(ctx) {
    	let flattoast;
    	let current;

    	flattoast = new FlatToast({
    			props: { data: /*data*/ ctx[12] },
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
    			if (dirty & /*data*/ 4096) flattoast_changes.data = /*data*/ ctx[12];
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
    		source: "(18:2) <ToastContainer let:data>",
    		ctx
    	});

    	return block;
    }

    // (22:2) {#if $FLAG_LOADING_SCREEN_SAVER}
    function create_if_block_3(ctx) {
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
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(22:2) {#if $FLAG_LOADING_SCREEN_SAVER}",
    		ctx
    	});

    	return block;
    }

    // (25:2) {#if $FLAG_YT_SEARCH_POPUP}
    function create_if_block_2(ctx) {
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
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(25:2) {#if $FLAG_YT_SEARCH_POPUP}",
    		ctx
    	});

    	return block;
    }

    // (87:43) {:else}
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
    			add_location(path, file, 92, 17, 3638);
    			attr_dev(svg, "class", "icon play svelte-1csrg2k");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file, 88, 14, 3493);
    			attr_dev(div, "id", "none-song");
    			attr_dev(div, "class", "svelte-1csrg2k");
    			add_location(div, file, 87, 12, 3458);
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
    		source: "(87:43) {:else}",
    		ctx
    	});

    	return block;
    }

    // (87:43) 
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
    		source: "(87:43) ",
    		ctx
    	});

    	return block;
    }

    // (85:10) {#if $YT_VIDEO_ID != ""}
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
    		source: "(85:10) {#if $YT_VIDEO_ID != \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (17:0) <Protector>
    function create_default_slot(ctx) {
    	let toastcontainer;
    	let t0;
    	let t1;
    	let t2;
    	let historylist;
    	let t3;
    	let div2;
    	let div0;
    	let t4;
    	let h1;
    	let t6;
    	let div1;
    	let span2;
    	let svg0;
    	let path0;
    	let t7;
    	let span0;
    	let t9;
    	let span1;
    	let indicator0;
    	let t10;
    	let span5;
    	let svg1;
    	let path1;
    	let t11;
    	let span3;
    	let t13;
    	let span4;
    	let indicator1;
    	let t14;
    	let div16;
    	let div5;
    	let songcontrol;
    	let t15;
    	let div4;
    	let div3;
    	let btn0;
    	let t16;
    	let div15;
    	let div9;
    	let div6;
    	let current_block_type_index;
    	let if_block2;
    	let t17;
    	let div8;
    	let div7;
    	let t19;
    	let nowplaying;
    	let t20;
    	let div14;
    	let div12;
    	let div10;
    	let t22;
    	let div11;
    	let btn1;
    	let t23;
    	let btn2;
    	let t24;
    	let btn3;
    	let t25;
    	let table;
    	let colgroup;
    	let col0;
    	let t26;
    	let col1;
    	let t27;
    	let col2;
    	let t28;
    	let col3;
    	let t29;
    	let col4;
    	let t30;
    	let col5;
    	let t31;
    	let thead;
    	let tr;
    	let th0;
    	let t33;
    	let th1;
    	let t35;
    	let th2;
    	let t37;
    	let th3;
    	let t39;
    	let th4;
    	let t41;
    	let th5;
    	let t43;
    	let div13;
    	let playlisttable;
    	let current;

    	toastcontainer = new ToastContainer({
    			props: {
    				$$slots: {
    					default: [
    						create_default_slot_1,
    						({ data }) => ({ 12: data }),
    						({ data }) => data ? 4096 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*$FLAG_LOADING_SCREEN_SAVER*/ ctx[0] && create_if_block_3(ctx);
    	let if_block1 = /*$FLAG_YT_SEARCH_POPUP*/ ctx[1] && create_if_block_2(ctx);
    	historylist = new HistoryList({ $$inline: true });

    	indicator0 = new Indicator({
    			props: { state: /*$FLAG_NETWORK_STATUS*/ ctx[2] },
    			$$inline: true
    		});

    	indicator1 = new Indicator({
    			props: { state: /*$FLAG_CLIENT_STATUS*/ ctx[3] },
    			$$inline: true
    		});

    	songcontrol = new SongControl({ $$inline: true });

    	btn0 = new Btn({
    			props: { label: "설정", onClick: /*func*/ ctx[8] },
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
    	if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	nowplaying = new NowPlaying({ $$inline: true });

    	btn1 = new Btn({
    			props: {
    				label: "YouTube 음원 추가",
    				onClick: /*func_1*/ ctx[9]
    			},
    			$$inline: true
    		});

    	btn2 = new Btn({
    			props: {
    				label: "로컬 음원파일 추가",
    				onClick: /*func_2*/ ctx[10]
    			},
    			$$inline: true
    		});

    	btn3 = new Btn({
    			props: {
    				label: `<svg style="width: 1em; height: 1em; fill: white;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C201.7 512 151.2 495 109.7 466.1C95.2 455.1 91.64 436 101.8 421.5C111.9 407 131.8 403.5 146.3 413.6C177.4 435.3 215.2 448 256 448C362 448 448 362 448 256C448 149.1 362 64 256 64C202.1 64 155 85.46 120.2 120.2L151 151C166.1 166.1 155.4 192 134.1 192H24C10.75 192 0 181.3 0 168V57.94C0 36.56 25.85 25.85 40.97 40.97L74.98 74.98C121.3 28.69 185.3 0 255.1 0L256 0zM256 128C269.3 128 280 138.7 280 152V246.1L344.1 311C354.3 320.4 354.3 335.6 344.1 344.1C335.6 354.3 320.4 354.3 311 344.1L239 272.1C234.5 268.5 232 262.4 232 256V152C232 138.7 242.7 128 256 128V128z"/></svg>`,
    				onClick: /*func_3*/ ctx[11]
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
    			create_component(historylist.$$.fragment);
    			t3 = space();
    			div2 = element("div");
    			div0 = element("div");
    			t4 = space();
    			h1 = element("h1");
    			h1.textContent = "STREAM-MUSIC";
    			t6 = space();
    			div1 = element("div");
    			span2 = element("span");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t7 = space();
    			span0 = element("span");
    			span0.textContent = "네트워크 연결상태";
    			t9 = space();
    			span1 = element("span");
    			create_component(indicator0.$$.fragment);
    			t10 = space();
    			span5 = element("span");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t11 = space();
    			span3 = element("span");
    			span3.textContent = "STREAM-MUSIC 클라이언트 연결상태";
    			t13 = space();
    			span4 = element("span");
    			create_component(indicator1.$$.fragment);
    			t14 = space();
    			div16 = element("div");
    			div5 = element("div");
    			create_component(songcontrol.$$.fragment);
    			t15 = space();
    			div4 = element("div");
    			div3 = element("div");
    			create_component(btn0.$$.fragment);
    			t16 = space();
    			div15 = element("div");
    			div9 = element("div");
    			div6 = element("div");
    			if_block2.c();
    			t17 = space();
    			div8 = element("div");
    			div7 = element("div");
    			div7.textContent = "Now Playing";
    			t19 = space();
    			create_component(nowplaying.$$.fragment);
    			t20 = space();
    			div14 = element("div");
    			div12 = element("div");
    			div10 = element("div");
    			div10.textContent = "PlayList";
    			t22 = space();
    			div11 = element("div");
    			create_component(btn1.$$.fragment);
    			t23 = space();
    			create_component(btn2.$$.fragment);
    			t24 = space();
    			create_component(btn3.$$.fragment);
    			t25 = space();
    			table = element("table");
    			colgroup = element("colgroup");
    			col0 = element("col");
    			t26 = space();
    			col1 = element("col");
    			t27 = space();
    			col2 = element("col");
    			t28 = space();
    			col3 = element("col");
    			t29 = space();
    			col4 = element("col");
    			t30 = space();
    			col5 = element("col");
    			t31 = space();
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "NO";
    			t33 = space();
    			th1 = element("th");
    			th1.textContent = "TITLE";
    			t35 = space();
    			th2 = element("th");
    			th2.textContent = "ARTIST";
    			t37 = space();
    			th3 = element("th");
    			th3.textContent = "PLATFORM";
    			t39 = space();
    			th4 = element("th");
    			th4.textContent = "DURATION";
    			t41 = space();
    			th5 = element("th");
    			th5.textContent = "ACTIONS";
    			t43 = space();
    			div13 = element("div");
    			create_component(playlisttable.$$.fragment);
    			attr_dev(div0, "class", "bg svelte-1csrg2k");
    			add_location(div0, file, 31, 4, 1104);
    			attr_dev(h1, "class", "svelte-1csrg2k");
    			add_location(h1, file, 32, 4, 1127);
    			attr_dev(path0, "d", "M319.1 351.1c-35.35 0-64 28.66-64 64.01s28.66 64.01 64 64.01c35.34 0 64-28.66 64-64.01S355.3 351.1 319.1 351.1zM320 191.1c-70.25 0-137.9 25.6-190.5 72.03C116.3 275.7 115 295.9 126.7 309.2C138.5 322.4 158.7 323.7 171.9 312C212.8 275.9 265.4 256 320 256s107.3 19.88 148.1 56C474.2 317.4 481.8 320 489.3 320c8.844 0 17.66-3.656 24-10.81C525 295.9 523.8 275.7 510.5 264C457.9 217.6 390.3 191.1 320 191.1zM630.2 156.7C546.3 76.28 436.2 32 320 32S93.69 76.28 9.844 156.7c-12.75 12.25-13.16 32.5-.9375 45.25c12.22 12.78 32.47 13.12 45.25 .9375C125.1 133.1 220.4 96 320 96s193.1 37.97 265.8 106.9C592.1 208.8 600 211.8 608 211.8c8.406 0 16.81-3.281 23.09-9.844C643.3 189.2 642.9 168.1 630.2 156.7z");
    			add_location(path0, file, 39, 11, 1344);
    			attr_dev(svg0, "class", "icon");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 640 512");
    			add_location(svg0, file, 35, 8, 1228);
    			add_location(span0, file, 43, 8, 2092);
    			add_location(span1, file, 44, 8, 2123);
    			attr_dev(span2, "class", "indicator");
    			add_location(span2, file, 34, 6, 1195);
    			attr_dev(path1, "d", "M528 0h-480C21.5 0 0 21.5 0 48v320C0 394.5 21.5 416 48 416h192L224 464H152C138.8 464 128 474.8 128 488S138.8 512 152 512h272c13.25 0 24-10.75 24-24s-10.75-24-24-24H352L336 416h192c26.5 0 48-21.5 48-48v-320C576 21.5 554.5 0 528 0zM512 288H64V64h448V288z");
    			add_location(path1, file, 53, 11, 2368);
    			attr_dev(svg1, "class", "icon");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 576 512");
    			add_location(svg1, file, 49, 8, 2252);
    			add_location(span3, file, 57, 8, 2679);
    			add_location(span4, file, 58, 8, 2724);
    			attr_dev(span5, "class", "indicator");
    			add_location(span5, file, 48, 6, 2219);
    			attr_dev(div1, "class", "connection-indicators");
    			add_location(div1, file, 33, 4, 1153);
    			attr_dev(div2, "id", "main-header");
    			attr_dev(div2, "class", "svelte-1csrg2k");
    			add_location(div2, file, 30, 2, 1077);
    			attr_dev(div3, "class", "btns svelte-1csrg2k");
    			add_location(div3, file, 69, 8, 2951);
    			attr_dev(div4, "class", "btns svelte-1csrg2k");
    			add_location(div4, file, 68, 6, 2924);
    			attr_dev(div5, "class", "block controller svelte-1csrg2k");
    			add_location(div5, file, 66, 4, 2865);
    			attr_dev(div6, "class", "sub-block player-area svelte-1csrg2k");
    			add_location(div6, file, 83, 8, 3299);
    			attr_dev(div7, "class", "title svelte-1csrg2k");
    			add_location(div7, file, 100, 10, 4147);
    			attr_dev(div8, "class", "sub-block svelte-1csrg2k");
    			add_location(div8, file, 99, 8, 4113);
    			attr_dev(div9, "class", "block info-area svelte-1csrg2k");
    			attr_dev(div9, "id", "song-area");
    			add_location(div9, file, 82, 6, 3246);
    			attr_dev(div10, "class", "title svelte-1csrg2k");
    			add_location(div10, file, 106, 10, 4335);
    			attr_dev(div11, "class", "btns svelte-1csrg2k");
    			add_location(div11, file, 107, 10, 4379);
    			attr_dev(div12, "class", "title-area svelte-1csrg2k");
    			add_location(div12, file, 105, 8, 4300);
    			attr_dev(col0, "width", "40px");
    			add_location(col0, file, 130, 12, 5756);
    			attr_dev(col1, "width", "300px");
    			add_location(col1, file, 131, 12, 5789);
    			attr_dev(col2, "width", "150px");
    			add_location(col2, file, 132, 12, 5823);
    			attr_dev(col3, "width", "70px");
    			add_location(col3, file, 133, 12, 5857);
    			attr_dev(col4, "width", "70px");
    			add_location(col4, file, 134, 12, 5890);
    			attr_dev(col5, "width", "100px");
    			add_location(col5, file, 135, 12, 5923);
    			add_location(colgroup, file, 129, 10, 5733);
    			attr_dev(th0, "class", "svelte-1csrg2k");
    			add_location(th0, file, 139, 14, 6016);
    			attr_dev(th1, "class", "svelte-1csrg2k");
    			add_location(th1, file, 140, 14, 6042);
    			attr_dev(th2, "class", "svelte-1csrg2k");
    			add_location(th2, file, 141, 14, 6071);
    			attr_dev(th3, "class", "svelte-1csrg2k");
    			add_location(th3, file, 142, 14, 6101);
    			attr_dev(th4, "class", "svelte-1csrg2k");
    			add_location(th4, file, 143, 14, 6133);
    			attr_dev(th5, "class", "svelte-1csrg2k");
    			add_location(th5, file, 144, 14, 6165);
    			attr_dev(tr, "class", "svelte-1csrg2k");
    			add_location(tr, file, 138, 12, 5997);
    			add_location(thead, file, 137, 10, 5977);
    			attr_dev(table, "class", "playlist-table svelte-1csrg2k");
    			add_location(table, file, 128, 8, 5692);
    			attr_dev(div13, "class", "playlist-table-scrollbox svelte-1csrg2k");
    			add_location(div13, file, 148, 8, 6244);
    			attr_dev(div14, "class", "block info-area svelte-1csrg2k");
    			attr_dev(div14, "id", "playlist-area");
    			add_location(div14, file, 104, 6, 4243);
    			attr_dev(div15, "class", "infomation svelte-1csrg2k");
    			add_location(div15, file, 81, 4, 3215);
    			attr_dev(div16, "id", "main-viewport");
    			attr_dev(div16, "class", "svelte-1csrg2k");
    			add_location(div16, file, 65, 2, 2836);
    		},
    		m: function mount(target, anchor) {
    			mount_component(toastcontainer, target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(historylist, target, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t4);
    			append_dev(div2, h1);
    			append_dev(div2, t6);
    			append_dev(div2, div1);
    			append_dev(div1, span2);
    			append_dev(span2, svg0);
    			append_dev(svg0, path0);
    			append_dev(span2, t7);
    			append_dev(span2, span0);
    			append_dev(span2, t9);
    			append_dev(span2, span1);
    			mount_component(indicator0, span1, null);
    			append_dev(div1, t10);
    			append_dev(div1, span5);
    			append_dev(span5, svg1);
    			append_dev(svg1, path1);
    			append_dev(span5, t11);
    			append_dev(span5, span3);
    			append_dev(span5, t13);
    			append_dev(span5, span4);
    			mount_component(indicator1, span4, null);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, div16, anchor);
    			append_dev(div16, div5);
    			mount_component(songcontrol, div5, null);
    			append_dev(div5, t15);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			mount_component(btn0, div3, null);
    			append_dev(div16, t16);
    			append_dev(div16, div15);
    			append_dev(div15, div9);
    			append_dev(div9, div6);
    			if_blocks[current_block_type_index].m(div6, null);
    			append_dev(div9, t17);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div8, t19);
    			mount_component(nowplaying, div8, null);
    			append_dev(div15, t20);
    			append_dev(div15, div14);
    			append_dev(div14, div12);
    			append_dev(div12, div10);
    			append_dev(div12, t22);
    			append_dev(div12, div11);
    			mount_component(btn1, div11, null);
    			append_dev(div11, t23);
    			mount_component(btn2, div11, null);
    			append_dev(div11, t24);
    			mount_component(btn3, div11, null);
    			append_dev(div14, t25);
    			append_dev(div14, table);
    			append_dev(table, colgroup);
    			append_dev(colgroup, col0);
    			append_dev(colgroup, t26);
    			append_dev(colgroup, col1);
    			append_dev(colgroup, t27);
    			append_dev(colgroup, col2);
    			append_dev(colgroup, t28);
    			append_dev(colgroup, col3);
    			append_dev(colgroup, t29);
    			append_dev(colgroup, col4);
    			append_dev(colgroup, t30);
    			append_dev(colgroup, col5);
    			append_dev(table, t31);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t33);
    			append_dev(tr, th1);
    			append_dev(tr, t35);
    			append_dev(tr, th2);
    			append_dev(tr, t37);
    			append_dev(tr, th3);
    			append_dev(tr, t39);
    			append_dev(tr, th4);
    			append_dev(tr, t41);
    			append_dev(tr, th5);
    			append_dev(div14, t43);
    			append_dev(div14, div13);
    			mount_component(playlisttable, div13, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const toastcontainer_changes = {};

    			if (dirty & /*$$scope, data*/ 12288) {
    				toastcontainer_changes.$$scope = { dirty, ctx };
    			}

    			toastcontainer.$set(toastcontainer_changes);

    			if (/*$FLAG_LOADING_SCREEN_SAVER*/ ctx[0]) {
    				if (if_block0) {
    					if (dirty & /*$FLAG_LOADING_SCREEN_SAVER*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3(ctx);
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
    					if_block1 = create_if_block_2(ctx);
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

    			const indicator0_changes = {};
    			if (dirty & /*$FLAG_NETWORK_STATUS*/ 4) indicator0_changes.state = /*$FLAG_NETWORK_STATUS*/ ctx[2];
    			indicator0.$set(indicator0_changes);
    			const indicator1_changes = {};
    			if (dirty & /*$FLAG_CLIENT_STATUS*/ 8) indicator1_changes.state = /*$FLAG_CLIENT_STATUS*/ ctx[3];
    			indicator1.$set(indicator1_changes);
    			const btn0_changes = {};
    			if (dirty & /*$PLAYER_ELEMENT*/ 16) btn0_changes.onClick = /*func*/ ctx[8];
    			btn0.$set(btn0_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block2 = if_blocks[current_block_type_index];

    				if (!if_block2) {
    					if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block2.c();
    				}

    				transition_in(if_block2, 1);
    				if_block2.m(div6, null);
    			}

    			const btn1_changes = {};
    			if (dirty & /*$FLAG_YT_SEARCH_POPUP*/ 2) btn1_changes.onClick = /*func_1*/ ctx[9];
    			btn1.$set(btn1_changes);
    			const btn3_changes = {};
    			if (dirty & /*$FLAG_HISTORY_LIST*/ 128) btn3_changes.onClick = /*func_3*/ ctx[11];
    			btn3.$set(btn3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toastcontainer.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(historylist.$$.fragment, local);
    			transition_in(indicator0.$$.fragment, local);
    			transition_in(indicator1.$$.fragment, local);
    			transition_in(songcontrol.$$.fragment, local);
    			transition_in(btn0.$$.fragment, local);
    			transition_in(if_block2);
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
    			transition_out(historylist.$$.fragment, local);
    			transition_out(indicator0.$$.fragment, local);
    			transition_out(indicator1.$$.fragment, local);
    			transition_out(songcontrol.$$.fragment, local);
    			transition_out(btn0.$$.fragment, local);
    			transition_out(if_block2);
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
    			destroy_component(historylist, detaching);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div2);
    			destroy_component(indicator0);
    			destroy_component(indicator1);
    			if (detaching) detach_dev(t14);
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
    		source: "(17:0) <Protector>",
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

    			if (dirty & /*$$scope, $FLAG_HISTORY_LIST, $FLAG_YT_SEARCH_POPUP, $YT_VIDEO_ID, $LOCAL_SONG_PATH, $PLAYER_ELEMENT, $FLAG_CLIENT_STATUS, $FLAG_NETWORK_STATUS, $FLAG_LOADING_SCREEN_SAVER*/ 8447) {
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
    	let $FLAG_NETWORK_STATUS;
    	let $FLAG_CLIENT_STATUS;
    	let $PLAYER_ELEMENT;
    	let $YT_VIDEO_ID;
    	let $LOCAL_SONG_PATH;
    	let $FLAG_HISTORY_LIST;
    	validate_store(FLAG_LOADING_SCREEN_SAVER, 'FLAG_LOADING_SCREEN_SAVER');
    	component_subscribe($$self, FLAG_LOADING_SCREEN_SAVER, $$value => $$invalidate(0, $FLAG_LOADING_SCREEN_SAVER = $$value));
    	validate_store(FLAG_YT_SEARCH_POPUP, 'FLAG_YT_SEARCH_POPUP');
    	component_subscribe($$self, FLAG_YT_SEARCH_POPUP, $$value => $$invalidate(1, $FLAG_YT_SEARCH_POPUP = $$value));
    	validate_store(FLAG_NETWORK_STATUS, 'FLAG_NETWORK_STATUS');
    	component_subscribe($$self, FLAG_NETWORK_STATUS, $$value => $$invalidate(2, $FLAG_NETWORK_STATUS = $$value));
    	validate_store(FLAG_CLIENT_STATUS, 'FLAG_CLIENT_STATUS');
    	component_subscribe($$self, FLAG_CLIENT_STATUS, $$value => $$invalidate(3, $FLAG_CLIENT_STATUS = $$value));
    	validate_store(PLAYER_ELEMENT, 'PLAYER_ELEMENT');
    	component_subscribe($$self, PLAYER_ELEMENT, $$value => $$invalidate(4, $PLAYER_ELEMENT = $$value));
    	validate_store(YT_VIDEO_ID, 'YT_VIDEO_ID');
    	component_subscribe($$self, YT_VIDEO_ID, $$value => $$invalidate(5, $YT_VIDEO_ID = $$value));
    	validate_store(LOCAL_SONG_PATH, 'LOCAL_SONG_PATH');
    	component_subscribe($$self, LOCAL_SONG_PATH, $$value => $$invalidate(6, $LOCAL_SONG_PATH = $$value));
    	validate_store(FLAG_HISTORY_LIST, 'FLAG_HISTORY_LIST');
    	component_subscribe($$self, FLAG_HISTORY_LIST, $$value => $$invalidate(7, $FLAG_HISTORY_LIST = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PlayerApp', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<PlayerApp> was created with unknown prop '${key}'`);
    	});

    	const func = () => {
    		infoToast("현재 서비스 준비중입니다!");
    		console.log($PLAYER_ELEMENT.getCurrentTime());
    	};

    	const func_1 = () => {
    		FLAG_YT_SEARCH_POPUP.set(!$FLAG_YT_SEARCH_POPUP);
    	};

    	const func_2 = () => {
    		infoToast("현재 서비스 준비중입니다!");
    	};

    	const func_3 = () => {
    		FLAG_HISTORY_LIST.set(!$FLAG_HISTORY_LIST);
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
    		infoToast,
    		FLAG_YT_SEARCH_POPUP,
    		FLAG_LOADING_SCREEN_SAVER,
    		FLAG_HISTORY_LIST,
    		FLAG_NETWORK_STATUS,
    		FLAG_CLIENT_STATUS,
    		YT_VIDEO_ID,
    		LOCAL_SONG_PATH,
    		PLAYER_ELEMENT,
    		$FLAG_LOADING_SCREEN_SAVER,
    		$FLAG_YT_SEARCH_POPUP,
    		$FLAG_NETWORK_STATUS,
    		$FLAG_CLIENT_STATUS,
    		$PLAYER_ELEMENT,
    		$YT_VIDEO_ID,
    		$LOCAL_SONG_PATH,
    		$FLAG_HISTORY_LIST
    	});

    	return [
    		$FLAG_LOADING_SCREEN_SAVER,
    		$FLAG_YT_SEARCH_POPUP,
    		$FLAG_NETWORK_STATUS,
    		$FLAG_CLIENT_STATUS,
    		$PLAYER_ELEMENT,
    		$YT_VIDEO_ID,
    		$LOCAL_SONG_PATH,
    		$FLAG_HISTORY_LIST,
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
