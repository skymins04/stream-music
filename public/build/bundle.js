
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
    const file$b = "node_modules/svelte-toasts/src/ToastContainer.svelte";

    function get_each_context$1(ctx, list, i) {
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
    function create_else_block$5(ctx) {
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
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(107:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (105:10) {#if toast.component}
    function create_if_block$6(ctx) {
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
    		id: create_if_block$6.name,
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
    	const if_block_creators = [create_if_block$6, create_else_block$5];
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
    			add_location(li, file$b, 99, 8, 2256);
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
    function create_each_block$1(ctx) {
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
    			add_location(ul, file$b, 95, 4, 2131);
    			attr_dev(div, "class", "toast-container " + /*placement*/ ctx[1] + " svelte-1rg6zyw");
    			set_style(div, "width", /*width*/ ctx[0]);
    			add_location(div, file$b, 94, 2, 2062);
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
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(94:0) {#each placements as placement}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*placements*/ ctx[3];
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
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
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
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
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
    			id: create_fragment$b.name
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
    const file$a = "node_modules/svelte-toasts/src/FlatToast.svelte";
    const get_close_icon_slot_changes = dirty => ({});
    const get_close_icon_slot_context = ctx => ({});
    const get_extra_slot_changes = dirty => ({});
    const get_extra_slot_context = ctx => ({});
    const get_icon_slot_changes = dirty => ({});
    const get_icon_slot_context = ctx => ({});

    // (92:4) {:else}
    function create_else_block$4(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M9.2,5h1.5v7H9.2V5z M10,16c-0.6,0-1-0.4-1-1s0.4-1,1-1\ts1,0.4,1,1S10.6,16,10,16z");
    			add_location(path0, file$a, 99, 9, 2534);
    			attr_dev(path1, "d", "M9.2,5h1.5v7H9.2V5z M10,16c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S10.6,16,10,16z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$a, 101, 10, 2690);
    			attr_dev(svg, "class", "st-toast-icon svelte-is9c7e");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$a, 92, 6, 2353);
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
    		id: create_else_block$4.name,
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
    			add_location(path0, file$a, 83, 9, 2085);
    			attr_dev(path1, "d", "M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$a, 85, 10, 2196);
    			attr_dev(svg, "class", "st-toast-icon svelte-is9c7e");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$a, 76, 6, 1904);
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
    function create_if_block_3$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm0,5a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,16,7Zm4,17.12H12V21.88h2.88V15.12H13V12.88h4.13v9H20Z");
    			add_location(path, file$a, 71, 9, 1681);
    			attr_dev(svg, "class", "st-toast-icon svelte-is9c7e");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 32 32");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$a, 64, 6, 1500);
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
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(64:35) ",
    		ctx
    	});

    	return block;
    }

    // (45:4) {#if data.type === 'success'}
    function create_if_block_2$1(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M10,1c-4.9,0-9,4.1-9,9s4.1,9,9,9s9-4,9-9S15,1,10,1z M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z");
    			add_location(path0, file$a, 53, 8, 1135);
    			attr_dev(path1, "fill", "none");
    			attr_dev(path1, "d", "M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$a, 56, 8, 1279);
    			attr_dev(svg, "class", "st-toast-icon svelte-is9c7e");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$a, 45, 6, 947);
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
    		id: create_if_block_2$1.name,
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
    		if (/*data*/ ctx[1].type === 'success') return create_if_block_2$1;
    		if (/*data*/ ctx[1].type === 'info') return create_if_block_3$1;
    		if (/*data*/ ctx[1].type === 'error') return create_if_block_4;
    		return create_else_block$4;
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
    function create_if_block_1$2(ctx) {
    	let h3;
    	let t_value = /*data*/ ctx[1].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = text(t_value);
    			attr_dev(h3, "class", "st-toast-title svelte-is9c7e");
    			add_location(h3, file$a, 112, 6, 2954);
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
    		id: create_if_block_1$2.name,
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
    			add_location(path, file$a, 135, 8, 3504);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "bx--toast-notification__close-icon svelte-is9c7e");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 32 32");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$a, 127, 6, 3295);
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
    function create_if_block$5(ctx) {
    	let progress_1;

    	const block = {
    		c: function create() {
    			progress_1 = element("progress");
    			set_style(progress_1, "height", /*data*/ ctx[1].duration > 0 ? '4px' : 0);
    			progress_1.value = /*$progress*/ ctx[2];
    			attr_dev(progress_1, "class", "svelte-is9c7e");
    			add_location(progress_1, file$a, 142, 4, 3699);
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
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(142:2) {#if data.showProgress}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
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
    	let if_block0 = /*data*/ ctx[1].title && create_if_block_1$2(ctx);
    	const extra_slot_template = /*#slots*/ ctx[7].extra;
    	const extra_slot = create_slot(extra_slot_template, ctx, /*$$scope*/ ctx[6], get_extra_slot_context);
    	const close_icon_slot_template = /*#slots*/ ctx[7]["close-icon"];
    	const close_icon_slot = create_slot(close_icon_slot_template, ctx, /*$$scope*/ ctx[6], get_close_icon_slot_context);
    	const close_icon_slot_or_fallback = close_icon_slot || fallback_block(ctx);
    	let if_block1 = /*data*/ ctx[1].showProgress && create_if_block$5(ctx);

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
    			add_location(p, file$a, 115, 4, 3014);
    			attr_dev(div0, "class", "st-toast-extra");
    			add_location(div0, file$a, 116, 4, 3073);
    			attr_dev(div1, "class", "st-toast-details svelte-is9c7e");
    			add_location(div1, file$a, 110, 2, 2896);
    			attr_dev(button, "class", "st-toast-close-btn svelte-is9c7e");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "aria-label", "close");
    			add_location(button, file$a, 120, 2, 3152);
    			attr_dev(div2, "class", div2_class_value = "st-toast flat " + (/*data*/ ctx[1].theme || /*theme*/ ctx[0]) + " " + (/*data*/ ctx[1].type || 'info') + " svelte-is9c7e");
    			attr_dev(div2, "role", "alert");
    			attr_dev(div2, "aria-live", "assertive");
    			attr_dev(div2, "aria-atomic", "true");
    			add_location(div2, file$a, 36, 0, 730);
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
    					if_block0 = create_if_block_1$2(ctx);
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
    					if_block1 = create_if_block$5(ctx);
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
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { theme: 0, data: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FlatToast",
    			options,
    			id: create_fragment$a.name
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
    const file$9 = "node_modules/svelte-youtube/src/index.svelte";

    function create_fragment$9(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "id", /*id*/ ctx[0]);
    			add_location(div0, file$9, 143, 2, 4083);
    			attr_dev(div1, "class", /*className*/ ctx[1]);
    			add_location(div1, file$9, 142, 0, 4057);
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
    		id: create_fragment$9.name,
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

    function instance$9($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { id: 0, videoId: 3, options: 4, class: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Src",
    			options,
    			id: create_fragment$9.name
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

    const FLAG_YT_SEARCH_POPUP = writable(false); // YouTube 음원 추가 팝업 플래그
    const FLAG_LOADING_SCREEN_SAVER = writable(false); // 로딩 스크린 세이버 플래그
    const FLAG_PLAYING = writable(false); // 재생 여부 플래그
    const FLAG_PLAYER_IS_READY = writable(false); // YouTube iframe의 Video on ready 여부 플래그
    const FLAG_NEXT_SONG_LOADING = writable(false); // 재생 대기열 내의 다음곡을 로딩중인지 여부 플래그
    const LOADING_SCREEN_SAVER_MSG = writable(""); // 로딩 스크린 세이버 메세지
    const YT_VIDEO_ID = writable(""); // YouTube iframe Video ID
    const LOCAL_SONG_PATH = writable(""); // 로컬 음원 파일 경로
    const PLAYER_ELEMENT = writable({}); // 플레이어 조작 객체
    const PLAYLIST = writable({
        // 현재재생곡, 재생대기열, 히스로리 객체
        currentSong: null,
        queue: [],
        history: [],
    });
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
        get_store_value(PLAYLIST).currentSong = null;
        YT_VIDEO_ID.set("");
        LOCAL_SONG_PATH.set("");
        FLAG_PLAYING.set(pause);
        PLAYER_ELEMENT.set({});
        FLAG_PLAYER_IS_READY.set(false);
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
                    YT_VIDEO_ID.set(get_store_value(PLAYLIST).queue[0].songId);
                    break;
                case "local":
                    LOCAL_SONG_PATH.set(get_store_value(PLAYLIST).queue[0].songId);
                    break;
            }
            const song = get_store_value(PLAYLIST).queue.shift();
            get_store_value(PLAYLIST).currentSong = song === undefined ? null : song;
            if (get_store_value(PLAYLIST).history.length == 50)
                get_store_value(PLAYLIST).history.splice(49, 1); // 히스토리는 최대 50개까지만 저장
            get_store_value(PLAYLIST).history.unshift(get_store_value(PLAYLIST).queue[0]);
            savePlayList();
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

    /* src/components/YTSearch.svelte generated by Svelte v3.48.0 */

    const file$8 = "src/components/YTSearch.svelte";

    // (86:6) {#if ytSearchID !== ""}
    function create_if_block$4(ctx) {
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
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(86:6) {#if ytSearchID !== \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
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
    	let if_block = /*ytSearchID*/ ctx[1] !== "" && create_if_block$4(ctx);

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
    			attr_dev(div0, "class", "exit-btn svelte-1fj935f");
    			add_location(div0, file$8, 63, 4, 2175);
    			attr_dev(div1, "class", "viewport-title svelte-1fj935f");
    			add_location(div1, file$8, 70, 6, 2323);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "ex) https://www.youtube.com/watch?v=-Y9VtoPvtuM");
    			attr_dev(input, "class", "svelte-1fj935f");
    			add_location(input, file$8, 72, 8, 2406);
    			attr_dev(button, "class", "svelte-1fj935f");
    			add_location(button, file$8, 81, 8, 2731);
    			attr_dev(div2, "class", "frm-input svelte-1fj935f");
    			add_location(div2, file$8, 71, 6, 2374);
    			attr_dev(div3, "class", "interface link svelte-1fj935f");
    			add_location(div3, file$8, 69, 4, 2288);
    			attr_dev(div4, "class", "displaynone svelte-1fj935f");
    			add_location(div4, file$8, 84, 4, 2801);
    			attr_dev(div5, "class", "viewport svelte-1fj935f");
    			add_location(div5, file$8, 62, 2, 2148);
    			attr_dev(div6, "id", "yt-search-popup");
    			attr_dev(div6, "class", "svelte-1fj935f");
    			add_location(div6, file$8, 61, 0, 2119);
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
    					listen_dev(input, "keypress", /*keypress_handler*/ ctx[7](event), false, false, false),
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
    					if_block = create_if_block$4(ctx);
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
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $PLAYLIST;
    	validate_store(PLAYLIST, 'PLAYLIST');
    	component_subscribe($$self, PLAYLIST, $$value => $$invalidate(9, $PLAYLIST = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('YTSearch', slots, []);
    	let ytURL;
    	let ytSearchID = "";
    	let ytPlayer = null;

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

    	const getDurationNumToStr = sec => {
    		const M = Math.floor(sec / 60);
    		const S = sec - M * 60;
    		const durationM = String(M).padStart(2, "0");
    		const durationS = String(S).padStart(2, "0");
    		return `${durationM}:${durationS}`;
    	};

    	const onReadyYoutubePlayer = event => {
    		ytPlayer = event.detail.target;
    	};

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
    			successToast("재생대기열에 추가되었습니다!");
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

    	const keypress_handler = event => {
    		const key = event.key || event.keyCode;
    		if (key === "Enter" || key === 13) return addQueueYT;
    	};

    	$$self.$capture_state = () => ({
    		errorToast,
    		successToast,
    		YouTube: Src,
    		FLAG_LOADING_SCREEN_SAVER,
    		FLAG_YT_SEARCH_POPUP,
    		LOADING_SCREEN_SAVER_MSG,
    		PLAYLIST,
    		savePlayList,
    		ytURL,
    		ytSearchID,
    		ytPlayer,
    		addQueueYT,
    		getDurationNumToStr,
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
    		input_input_handler,
    		keypress_handler
    	];
    }

    class YTSearch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "YTSearch",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/components/LoadingScreenSaver.svelte generated by Svelte v3.48.0 */
    const file$7 = "src/components/LoadingScreenSaver.svelte";

    function create_fragment$7(ctx) {
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
    			add_location(span, file$7, 5, 4, 134);
    			attr_dev(img, "class", "loading-icon svelte-1a23iik");
    			if (!src_url_equal(img.src, img_src_value = "img/loading-icon.gif")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$7, 6, 4, 191);
    			attr_dev(div0, "class", "dialog svelte-1a23iik");
    			add_location(div0, file$7, 4, 2, 109);
    			attr_dev(div1, "id", "screen-saver");
    			attr_dev(div1, "class", "svelte-1a23iik");
    			add_location(div1, file$7, 3, 0, 83);
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoadingScreenSaver",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/components/Btn.svelte generated by Svelte v3.48.0 */

    const file$6 = "src/components/Btn.svelte";

    function create_fragment$6(ctx) {
    	let div;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*label*/ ctx[0]);
    			attr_dev(div, "class", "btn svelte-154qrd9");
    			add_location(div, file$6, 4, 0, 67);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);

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
    			if (dirty & /*label*/ 1) set_data_dev(t, /*label*/ ctx[0]);
    		},
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
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { label: 0, onClick: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Btn",
    			options,
    			id: create_fragment$6.name
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

    /* src/components/SongControl.svelte generated by Svelte v3.48.0 */

    const file$5 = "src/components/SongControl.svelte";

    // (56:4) {:else}
    function create_else_block$3(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM224 191.1v128C224 337.7 209.7 352 192 352S160 337.7 160 320V191.1C160 174.3 174.3 160 191.1 160S224 174.3 224 191.1zM352 191.1v128C352 337.7 337.7 352 320 352S288 337.7 288 320V191.1C288 174.3 302.3 160 319.1 160S352 174.3 352 191.1z");
    			add_location(path, file$5, 60, 9, 1994);
    			attr_dev(svg, "class", "icon pause svelte-6442wt");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file$5, 56, 6, 1880);
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
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(56:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (47:4) {#if !$FLAG_PLAYING}
    function create_if_block$3(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM176 168V344C176 352.7 180.7 360.7 188.3 364.9C195.8 369.2 205.1 369 212.5 364.5L356.5 276.5C363.6 272.1 368 264.4 368 256C368 247.6 363.6 239.9 356.5 235.5L212.5 147.5C205.1 142.1 195.8 142.8 188.3 147.1C180.7 151.3 176 159.3 176 168V168z");
    			add_location(path, file$5, 51, 9, 1469);
    			attr_dev(svg, "class", "icon play svelte-6442wt");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file$5, 47, 6, 1356);
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
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(47:4) {#if !$FLAG_PLAYING}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let div1;
    	let svg0;
    	let path0;
    	let t1;
    	let div2;
    	let svg1;
    	let path1;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (!/*$FLAG_PLAYING*/ ctx[0]) return create_if_block$3;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
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
    			attr_dev(div0, "class", "song-control-btn svelte-6442wt");
    			attr_dev(div0, "id", "play-btn");
    			add_location(div0, file$5, 45, 2, 1256);
    			attr_dev(path0, "d", "M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM352 328c0 13.2-10.8 24-24 24h-144C170.8 352 160 341.2 160 328v-144C160 170.8 170.8 160 184 160h144C341.2 160 352 170.8 352 184V328z");
    			add_location(path0, file$5, 71, 7, 2551);
    			attr_dev(svg0, "class", "icon stop svelte-6442wt");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 512 512");
    			add_location(svg0, file$5, 67, 4, 2446);
    			attr_dev(div1, "class", "song-control-btn svelte-6442wt");
    			attr_dev(div1, "id", "stop-btn");
    			add_location(div1, file$5, 66, 2, 2373);
    			attr_dev(path1, "d", "M287.1 447.1c17.67 0 31.1-14.33 31.1-32V96.03c0-17.67-14.33-32-32-32c-17.67 0-31.1 14.33-31.1 31.1v319.9C255.1 433.6 270.3 447.1 287.1 447.1zM52.51 440.6l192-159.1c7.625-6.436 11.43-15.53 11.43-24.62c0-9.094-3.809-18.18-11.43-24.62l-192-159.1C31.88 54.28 0 68.66 0 96.03v319.9C0 443.3 31.88 457.7 52.51 440.6z");
    			add_location(path1, file$5, 81, 7, 3017);
    			attr_dev(svg1, "class", "icon forward svelte-6442wt");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 320 512");
    			add_location(svg1, file$5, 77, 4, 2909);
    			attr_dev(div2, "class", "song-control-btn svelte-6442wt");
    			attr_dev(div2, "id", "forward-btn");
    			add_location(div2, file$5, 76, 2, 2830);
    			attr_dev(div3, "id", "song-control-interface");
    			attr_dev(div3, "class", "svelte-6442wt");
    			add_location(div3, file$5, 44, 0, 1220);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			if_block.m(div0, null);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div1, svg0);
    			append_dev(svg0, path0);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, svg1);
    			append_dev(svg1, path1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*clickPlayBtn*/ ctx[1], false, false, false),
    					listen_dev(div1, "click", /*clickStopBtn*/ ctx[2], false, false, false),
    					listen_dev(div2, "click", /*clickForwardBtn*/ ctx[3], false, false, false)
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
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if_block.d();
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

    function instance$5($$self, $$props, $$invalidate) {
    	let $FLAG_PLAYING;
    	let $PLAYER_ELEMENT;
    	let $PLAYLIST;
    	validate_store(FLAG_PLAYING, 'FLAG_PLAYING');
    	component_subscribe($$self, FLAG_PLAYING, $$value => $$invalidate(0, $FLAG_PLAYING = $$value));
    	validate_store(PLAYER_ELEMENT, 'PLAYER_ELEMENT');
    	component_subscribe($$self, PLAYER_ELEMENT, $$value => $$invalidate(4, $PLAYER_ELEMENT = $$value));
    	validate_store(PLAYLIST, 'PLAYLIST');
    	component_subscribe($$self, PLAYLIST, $$value => $$invalidate(5, $PLAYLIST = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SongControl', slots, []);

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
    				if ($FLAG_PLAYING) $PLAYER_ELEMENT.playVideo(); else $PLAYER_ELEMENT.pauseVideo();
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

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SongControl> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		errorToast,
    		FLAG_PLAYING,
    		PLAYLIST,
    		PLAYER_ELEMENT,
    		playSong,
    		stopSong,
    		fowardSong,
    		clickPlayBtn,
    		clickStopBtn,
    		clickForwardBtn,
    		$FLAG_PLAYING,
    		$PLAYER_ELEMENT,
    		$PLAYLIST
    	});

    	return [$FLAG_PLAYING, clickPlayBtn, clickStopBtn, clickForwardBtn];
    }

    class SongControl extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SongControl",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/components/WritableText.svelte generated by Svelte v3.48.0 */
    const file$4 = "src/components/WritableText.svelte";

    function create_fragment$4(ctx) {
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
    			add_location(path, file$4, 26, 7, 638);
    			attr_dev(svg, "class", "write-icon svelte-1f3l9f2");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file$4, 22, 18, 532);
    			attr_dev(span0, "class", "text svelte-1f3l9f2");
    			toggle_class(span0, "display-none", /*writeMode*/ ctx[1]);
    			add_location(span0, file$4, 16, 2, 397);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "svelte-1f3l9f2");
    			add_location(input, file$4, 32, 4, 1273);
    			attr_dev(button, "class", "svelte-1f3l9f2");
    			add_location(button, file$4, 33, 4, 1327);
    			attr_dev(span1, "class", "write-area svelte-1f3l9f2");
    			toggle_class(span1, "display-none", !/*writeMode*/ ctx[1]);
    			add_location(span1, file$4, 31, 2, 1211);
    			attr_dev(div, "class", "writable-text svelte-1f3l9f2");
    			add_location(div, file$4, 15, 0, 367);
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

    			if (dirty & /*writeMode*/ 2) {
    				toggle_class(span0, "display-none", /*writeMode*/ ctx[1]);
    			}

    			if (dirty & /*inputTextValue*/ 4 && input.value !== /*inputTextValue*/ ctx[2]) {
    				set_input_value(input, /*inputTextValue*/ ctx[2]);
    			}

    			if (dirty & /*writeMode*/ 2) {
    				toggle_class(span1, "display-none", !/*writeMode*/ ctx[1]);
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
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('WritableText', slots, []);
    	let { option } = $$props;
    	let writeMode = false;
    	let inputTextValue = option.text;

    	/**
     * PlayList 내 텍스트를 수정하는 함수
     */
    	const saveText = () => {
    		get_store_value(PLAYLIST).queue[option.index][option.key] = inputTextValue;
    		savePlayList();
    		$$invalidate(1, writeMode = false);
    	};

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
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { option: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WritableText",
    			options,
    			id: create_fragment$4.name
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

    /* src/components/EmptyCover.svelte generated by Svelte v3.48.0 */

    const file$3 = "src/components/EmptyCover.svelte";

    function create_fragment$3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "empty-cover svelte-ctrb31");
    			set_style(div, "height", /*height*/ ctx[1]);
    			add_location(div, file$3, 4, 0, 102);
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
    			if (dirty & /*height*/ 2) {
    				set_style(div, "height", /*height*/ ctx[1]);
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
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EmptyCover', slots, []);
    	let { msg } = $$props;
    	let { height = "calc(100% - 1.5em - 0.8em - 20px)" } = $$props;
    	const writable_props = ['msg', 'height'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EmptyCover> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('msg' in $$props) $$invalidate(0, msg = $$props.msg);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    	};

    	$$self.$capture_state = () => ({ msg, height });

    	$$self.$inject_state = $$props => {
    		if ('msg' in $$props) $$invalidate(0, msg = $$props.msg);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [msg, height];
    }

    class EmptyCover extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { msg: 0, height: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EmptyCover",
    			options,
    			id: create_fragment$3.name
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

    	get height() {
    		throw new Error("<EmptyCover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<EmptyCover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/PlayListTable.svelte generated by Svelte v3.48.0 */
    const file$2 = "src/components/PlayListTable.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[8] = i;
    	return child_ctx;
    }

    // (112:0) {:else}
    function create_else_block$2(ctx) {
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
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(112:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (35:0) {#if $PLAYLIST.queue.length != 0}
    function create_if_block$2(ctx) {
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
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
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
    			add_location(col0, file$2, 37, 6, 1088);
    			attr_dev(col1, "width", "300px");
    			add_location(col1, file$2, 38, 6, 1115);
    			attr_dev(col2, "width", "150px");
    			add_location(col2, file$2, 39, 6, 1143);
    			attr_dev(col3, "width", "70px");
    			add_location(col3, file$2, 40, 6, 1171);
    			attr_dev(col4, "width", "70px");
    			add_location(col4, file$2, 41, 6, 1198);
    			attr_dev(col5, "width", "100px");
    			add_location(col5, file$2, 42, 6, 1225);
    			add_location(colgroup, file$2, 36, 4, 1071);
    			add_location(tbody, file$2, 44, 4, 1267);
    			attr_dev(table, "class", "playlist-table svelte-1mvovjo");
    			add_location(table, file$2, 35, 2, 1036);
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
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
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
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(35:0) {#if $PLAYLIST.queue.length != 0}",
    		ctx
    	});

    	return block;
    }

    // (46:6) {#each $PLAYLIST.queue as song, i}
    function create_each_block(ctx) {
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
    					index: /*i*/ ctx[8]
    				}
    			},
    			$$inline: true
    		});

    	writabletext1 = new WritableText({
    			props: {
    				option: {
    					text: /*song*/ ctx[6].artist,
    					key: "artist",
    					index: /*i*/ ctx[8]
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
    			attr_dev(td0, "class", "svelte-1mvovjo");
    			add_location(td0, file$2, 47, 10, 1339);
    			attr_dev(td1, "class", "svelte-1mvovjo");
    			add_location(td1, file$2, 48, 10, 1366);
    			attr_dev(td2, "class", "svelte-1mvovjo");
    			add_location(td2, file$2, 53, 10, 1506);
    			attr_dev(td3, "class", "svelte-1mvovjo");
    			add_location(td3, file$2, 58, 10, 1648);
    			attr_dev(td4, "class", "svelte-1mvovjo");
    			add_location(td4, file$2, 59, 10, 1679);
    			attr_dev(path0, "d", "M9.39 265.4l127.1-128C143.6 131.1 151.8 128 160 128s16.38 3.125 22.63 9.375l127.1 128c9.156 9.156 11.9 22.91 6.943 34.88S300.9 320 287.1 320H32.01c-12.94 0-24.62-7.781-29.58-19.75S.2333 274.5 9.39 265.4z");
    			add_location(path0, file$2, 71, 17, 2031);
    			attr_dev(svg0, "class", "icon svelte-1mvovjo");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "viewBox", "0 0 320 512");
    			add_location(svg0, file$2, 67, 14, 1891);
    			attr_dev(div0, "class", "song-setting-btn song-up svelte-1mvovjo");
    			add_location(div0, file$2, 61, 12, 1731);
    			attr_dev(path1, "d", "M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z");
    			add_location(path1, file$2, 86, 17, 2640);
    			attr_dev(svg1, "class", "icon svelte-1mvovjo");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "viewBox", "0 0 320 512");
    			add_location(svg1, file$2, 82, 14, 2500);
    			attr_dev(div1, "class", "song-setting-btn song-down svelte-1mvovjo");
    			add_location(div1, file$2, 76, 12, 2334);
    			attr_dev(path2, "d", "M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z");
    			add_location(path2, file$2, 101, 17, 3243);
    			attr_dev(svg2, "class", "icon svelte-1mvovjo");
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "viewBox", "0 0 320 512");
    			add_location(svg2, file$2, 97, 14, 3103);
    			attr_dev(div2, "class", "song-setting-btn song-del svelte-1mvovjo");
    			add_location(div2, file$2, 91, 12, 2945);
    			attr_dev(td5, "class", "svelte-1mvovjo");
    			add_location(td5, file$2, 60, 10, 1714);
    			attr_dev(tr, "class", "svelte-1mvovjo");
    			add_location(tr, file$2, 46, 8, 1324);
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
    				index: /*i*/ ctx[8]
    			};

    			writabletext0.$set(writabletext0_changes);
    			const writabletext1_changes = {};

    			if (dirty & /*$PLAYLIST*/ 1) writabletext1_changes.option = {
    				text: /*song*/ ctx[6].artist,
    				key: "artist",
    				index: /*i*/ ctx[8]
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
    		id: create_each_block.name,
    		type: "each",
    		source: "(46:6) {#each $PLAYLIST.queue as song, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$2];
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
    		PLAYLIST,
    		savePlayList,
    		successToast,
    		WritableText,
    		EmptyCover,
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
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PlayListTable",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/NowPlaying.svelte generated by Svelte v3.48.0 */
    const file$1 = "src/components/NowPlaying.svelte";

    // (29:0) {:else}
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
    		source: "(29:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (5:0) {#if $PLAYLIST.currentSong !== null}
    function create_if_block$1(ctx) {
    	let div;
    	let span1;
    	let t0;
    	let span0;
    	let t1_value = /*$PLAYLIST*/ ctx[0].currentSong.title + "";
    	let t1;
    	let t2;
    	let span3;
    	let t3;
    	let span2;
    	let t4_value = /*$PLAYLIST*/ ctx[0].currentSong.artist + "";
    	let t4;
    	let t5;
    	let span5;
    	let t6;
    	let span4;
    	let t7_value = /*$PLAYLIST*/ ctx[0].currentSong.duration + "";
    	let t7;
    	let t8;
    	let span7;
    	let t9;
    	let span6;
    	let t10_value = /*$PLAYLIST*/ ctx[0].currentSong.type + "";
    	let t10;
    	let t11;
    	let if_block = /*$PLAYLIST*/ ctx[0].currentSong.type === "youtube" && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			span1 = element("span");
    			t0 = text("- TITLE: ");
    			span0 = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			span3 = element("span");
    			t3 = text("- ARTIST: ");
    			span2 = element("span");
    			t4 = text(t4_value);
    			t5 = space();
    			span5 = element("span");
    			t6 = text("- DURATION: ");
    			span4 = element("span");
    			t7 = text(t7_value);
    			t8 = space();
    			span7 = element("span");
    			t9 = text("- PLATFORM: ");
    			span6 = element("span");
    			t10 = text(t10_value);
    			t11 = space();
    			if (if_block) if_block.c();
    			attr_dev(span0, "class", "bold svelte-1gwplk1");
    			add_location(span0, file$1, 7, 16, 218);
    			attr_dev(span1, "class", "line svelte-1gwplk1");
    			add_location(span1, file$1, 6, 4, 183);
    			attr_dev(span2, "class", "bold svelte-1gwplk1");
    			add_location(span2, file$1, 10, 16, 326);
    			attr_dev(span3, "class", "line svelte-1gwplk1");
    			add_location(span3, file$1, 9, 4, 290);
    			attr_dev(span4, "class", "bold svelte-1gwplk1");
    			add_location(span4, file$1, 13, 18, 437);
    			attr_dev(span5, "class", "line svelte-1gwplk1");
    			add_location(span5, file$1, 12, 4, 399);
    			attr_dev(span6, "class", "bold svelte-1gwplk1");
    			add_location(span6, file$1, 16, 18, 550);
    			attr_dev(span7, "class", "line svelte-1gwplk1");
    			add_location(span7, file$1, 15, 4, 512);
    			attr_dev(div, "class", "current-song svelte-1gwplk1");
    			add_location(div, file$1, 5, 2, 152);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span1);
    			append_dev(span1, t0);
    			append_dev(span1, span0);
    			append_dev(span0, t1);
    			append_dev(div, t2);
    			append_dev(div, span3);
    			append_dev(span3, t3);
    			append_dev(span3, span2);
    			append_dev(span2, t4);
    			append_dev(div, t5);
    			append_dev(div, span5);
    			append_dev(span5, t6);
    			append_dev(span5, span4);
    			append_dev(span4, t7);
    			append_dev(div, t8);
    			append_dev(div, span7);
    			append_dev(span7, t9);
    			append_dev(span7, span6);
    			append_dev(span6, t10);
    			append_dev(div, t11);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$PLAYLIST*/ 1 && t1_value !== (t1_value = /*$PLAYLIST*/ ctx[0].currentSong.title + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*$PLAYLIST*/ 1 && t4_value !== (t4_value = /*$PLAYLIST*/ ctx[0].currentSong.artist + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*$PLAYLIST*/ 1 && t7_value !== (t7_value = /*$PLAYLIST*/ ctx[0].currentSong.duration + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*$PLAYLIST*/ 1 && t10_value !== (t10_value = /*$PLAYLIST*/ ctx[0].currentSong.type + "")) set_data_dev(t10, t10_value);

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
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(5:0) {#if $PLAYLIST.currentSong !== null}",
    		ctx
    	});

    	return block;
    }

    // (19:4) {#if $PLAYLIST.currentSong.type === "youtube"}
    function create_if_block_1$1(ctx) {
    	let span;
    	let a;
    	let t0;
    	let t1_value = /*$PLAYLIST*/ ctx[0].currentSong.songId + "";
    	let t1;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			a = element("a");
    			t0 = text("https://youtube.com/watch?v=");
    			t1 = text(t1_value);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "href", a_href_value = "https://youtube.com/watch?v=" + /*$PLAYLIST*/ ctx[0].currentSong.songId);
    			add_location(a, file$1, 20, 8, 702);
    			attr_dev(span, "class", "line svelte-1gwplk1");
    			add_location(span, file$1, 19, 6, 674);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, a);
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
    		source: "(19:4) {#if $PLAYLIST.currentSong.type === \\\"youtube\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block$1];
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
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $PLAYLIST;
    	validate_store(PLAYLIST, 'PLAYLIST');
    	component_subscribe($$self, PLAYLIST, $$value => $$invalidate(0, $PLAYLIST = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NowPlaying', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NowPlaying> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ PLAYLIST, EmptyCover, $PLAYLIST });
    	return [$PLAYLIST];
    }

    class NowPlaying extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NowPlaying",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/components/App.svelte generated by Svelte v3.48.0 */

    const file = "src/components/App.svelte";

    // (54:0) <ToastContainer let:data>
    function create_default_slot(ctx) {
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
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(54:0) <ToastContainer let:data>",
    		ctx
    	});

    	return block;
    }

    // (58:0) {#if $FLAG_LOADING_SCREEN_SAVER}
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
    		source: "(58:0) {#if $FLAG_LOADING_SCREEN_SAVER}",
    		ctx
    	});

    	return block;
    }

    // (61:0) {#if $FLAG_YT_SEARCH_POPUP}
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
    		source: "(61:0) {#if $FLAG_YT_SEARCH_POPUP}",
    		ctx
    	});

    	return block;
    }

    // (94:41) {:else}
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
    			add_location(path, file, 99, 15, 2767);
    			attr_dev(svg, "class", "icon play svelte-1i5nhhq");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file, 95, 12, 2630);
    			attr_dev(div, "id", "none-song");
    			attr_dev(div, "class", "svelte-1i5nhhq");
    			add_location(div, file, 94, 10, 2597);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    		},
    		p: noop,
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
    		source: "(94:41) {:else}",
    		ctx
    	});

    	return block;
    }

    // (94:41) 
    function create_if_block_1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(94:41) ",
    		ctx
    	});

    	return block;
    }

    // (88:8) {#if $YT_VIDEO_ID != ""}
    function create_if_block(ctx) {
    	let youtube;
    	let current;

    	youtube = new Src({
    			props: { videoId: /*$YT_VIDEO_ID*/ ctx[2] },
    			$$inline: true
    		});

    	youtube.$on("ready", /*onReadyYoutubePlayer*/ ctx[4]);
    	youtube.$on("stateChange", /*onStateChangeYoutubePlayer*/ ctx[5]);

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
    			if (dirty & /*$YT_VIDEO_ID*/ 4) youtube_changes.videoId = /*$YT_VIDEO_ID*/ ctx[2];
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
    		id: create_if_block.name,
    		type: "if",
    		source: "(88:8) {#if $YT_VIDEO_ID != \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let toastcontainer;
    	let t0;
    	let t1;
    	let t2;
    	let div1;
    	let div0;
    	let t3;
    	let h1;
    	let t5;
    	let div15;
    	let div4;
    	let songcontrol;
    	let t6;
    	let div3;
    	let div2;
    	let btn0;
    	let t7;
    	let div14;
    	let div8;
    	let div5;
    	let current_block_type_index;
    	let if_block2;
    	let t8;
    	let div7;
    	let div6;
    	let t10;
    	let nowplaying;
    	let t11;
    	let div13;
    	let div11;
    	let div9;
    	let t13;
    	let div10;
    	let btn1;
    	let t14;
    	let btn2;
    	let t15;
    	let table;
    	let colgroup;
    	let col0;
    	let t16;
    	let col1;
    	let t17;
    	let col2;
    	let t18;
    	let col3;
    	let t19;
    	let col4;
    	let t20;
    	let col5;
    	let t21;
    	let thead;
    	let tr;
    	let th0;
    	let t23;
    	let th1;
    	let t25;
    	let th2;
    	let t27;
    	let th3;
    	let t29;
    	let th4;
    	let t31;
    	let th5;
    	let t33;
    	let div12;
    	let playlisttable;
    	let current;

    	toastcontainer = new ToastContainer({
    			props: {
    				$$slots: {
    					default: [
    						create_default_slot,
    						({ data }) => ({ 11: data }),
    						({ data }) => data ? 2048 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*$FLAG_LOADING_SCREEN_SAVER*/ ctx[0] && create_if_block_3(ctx);
    	let if_block1 = /*$FLAG_YT_SEARCH_POPUP*/ ctx[1] && create_if_block_2(ctx);
    	songcontrol = new SongControl({ $$inline: true });

    	btn0 = new Btn({
    			props: { label: "설정", onClick: /*func*/ ctx[6] },
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block, create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$YT_VIDEO_ID*/ ctx[2] != "") return 0;
    		if (/*$LOCAL_SONG_PATH*/ ctx[3] != "") return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	nowplaying = new NowPlaying({ $$inline: true });

    	btn1 = new Btn({
    			props: {
    				label: "YouTube 음원 추가",
    				onClick: /*func_1*/ ctx[7]
    			},
    			$$inline: true
    		});

    	btn2 = new Btn({
    			props: {
    				label: "로컬 음원파일 추가",
    				onClick: /*func_2*/ ctx[8]
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
    			div1 = element("div");
    			div0 = element("div");
    			t3 = space();
    			h1 = element("h1");
    			h1.textContent = "STREAM-MUSIC";
    			t5 = space();
    			div15 = element("div");
    			div4 = element("div");
    			create_component(songcontrol.$$.fragment);
    			t6 = space();
    			div3 = element("div");
    			div2 = element("div");
    			create_component(btn0.$$.fragment);
    			t7 = space();
    			div14 = element("div");
    			div8 = element("div");
    			div5 = element("div");
    			if_block2.c();
    			t8 = space();
    			div7 = element("div");
    			div6 = element("div");
    			div6.textContent = "Now Playing";
    			t10 = space();
    			create_component(nowplaying.$$.fragment);
    			t11 = space();
    			div13 = element("div");
    			div11 = element("div");
    			div9 = element("div");
    			div9.textContent = "PlayList";
    			t13 = space();
    			div10 = element("div");
    			create_component(btn1.$$.fragment);
    			t14 = space();
    			create_component(btn2.$$.fragment);
    			t15 = space();
    			table = element("table");
    			colgroup = element("colgroup");
    			col0 = element("col");
    			t16 = space();
    			col1 = element("col");
    			t17 = space();
    			col2 = element("col");
    			t18 = space();
    			col3 = element("col");
    			t19 = space();
    			col4 = element("col");
    			t20 = space();
    			col5 = element("col");
    			t21 = space();
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "NO";
    			t23 = space();
    			th1 = element("th");
    			th1.textContent = "TITLE";
    			t25 = space();
    			th2 = element("th");
    			th2.textContent = "ARTIST";
    			t27 = space();
    			th3 = element("th");
    			th3.textContent = "PLATFORM";
    			t29 = space();
    			th4 = element("th");
    			th4.textContent = "DURATION";
    			t31 = space();
    			th5 = element("th");
    			th5.textContent = "ACTIONS";
    			t33 = space();
    			div12 = element("div");
    			create_component(playlisttable.$$.fragment);
    			attr_dev(div0, "class", "bg svelte-1i5nhhq");
    			add_location(div0, file, 65, 2, 1881);
    			attr_dev(h1, "class", "svelte-1i5nhhq");
    			add_location(h1, file, 66, 2, 1902);
    			attr_dev(div1, "id", "main-header");
    			attr_dev(div1, "class", "svelte-1i5nhhq");
    			add_location(div1, file, 64, 0, 1856);
    			attr_dev(div2, "class", "btns svelte-1i5nhhq");
    			add_location(div2, file, 73, 6, 2039);
    			attr_dev(div3, "class", "btns svelte-1i5nhhq");
    			add_location(div3, file, 72, 4, 2014);
    			attr_dev(div4, "class", "block controller svelte-1i5nhhq");
    			add_location(div4, file, 70, 2, 1959);
    			attr_dev(div5, "class", "sub-block player-area svelte-1i5nhhq");
    			add_location(div5, file, 86, 6, 2302);
    			attr_dev(div6, "class", "title svelte-1i5nhhq");
    			add_location(div6, file, 107, 8, 3260);
    			attr_dev(div7, "class", "sub-block svelte-1i5nhhq");
    			add_location(div7, file, 106, 6, 3228);
    			attr_dev(div8, "class", "block info-area svelte-1i5nhhq");
    			attr_dev(div8, "id", "song-area");
    			add_location(div8, file, 85, 4, 2251);
    			attr_dev(div9, "class", "title svelte-1i5nhhq");
    			add_location(div9, file, 113, 8, 3436);
    			attr_dev(div10, "class", "btns svelte-1i5nhhq");
    			add_location(div10, file, 114, 8, 3478);
    			attr_dev(div11, "class", "title-area svelte-1i5nhhq");
    			add_location(div11, file, 112, 6, 3403);
    			attr_dev(col0, "width", "40px");
    			add_location(col0, file, 131, 10, 3911);
    			attr_dev(col1, "width", "300px");
    			add_location(col1, file, 132, 10, 3942);
    			attr_dev(col2, "width", "150px");
    			add_location(col2, file, 133, 10, 3974);
    			attr_dev(col3, "width", "70px");
    			add_location(col3, file, 134, 10, 4006);
    			attr_dev(col4, "width", "70px");
    			add_location(col4, file, 135, 10, 4037);
    			attr_dev(col5, "width", "100px");
    			add_location(col5, file, 136, 10, 4068);
    			add_location(colgroup, file, 130, 8, 3890);
    			attr_dev(th0, "class", "svelte-1i5nhhq");
    			add_location(th0, file, 140, 12, 4153);
    			attr_dev(th1, "class", "svelte-1i5nhhq");
    			add_location(th1, file, 141, 12, 4177);
    			attr_dev(th2, "class", "svelte-1i5nhhq");
    			add_location(th2, file, 142, 12, 4204);
    			attr_dev(th3, "class", "svelte-1i5nhhq");
    			add_location(th3, file, 143, 12, 4232);
    			attr_dev(th4, "class", "svelte-1i5nhhq");
    			add_location(th4, file, 144, 12, 4262);
    			attr_dev(th5, "class", "svelte-1i5nhhq");
    			add_location(th5, file, 145, 12, 4292);
    			attr_dev(tr, "class", "svelte-1i5nhhq");
    			add_location(tr, file, 139, 10, 4136);
    			add_location(thead, file, 138, 8, 4118);
    			attr_dev(table, "class", "playlist-table svelte-1i5nhhq");
    			add_location(table, file, 129, 6, 3851);
    			attr_dev(div12, "class", "playlist-table-scrollbox svelte-1i5nhhq");
    			add_location(div12, file, 149, 6, 4363);
    			attr_dev(div13, "class", "block info-area svelte-1i5nhhq");
    			attr_dev(div13, "id", "playlist-area");
    			add_location(div13, file, 111, 4, 3348);
    			attr_dev(div14, "class", "infomation svelte-1i5nhhq");
    			add_location(div14, file, 84, 2, 2222);
    			attr_dev(div15, "id", "main-viewport");
    			attr_dev(div15, "class", "svelte-1i5nhhq");
    			add_location(div15, file, 69, 0, 1932);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(toastcontainer, target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t3);
    			append_dev(div1, h1);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div15, anchor);
    			append_dev(div15, div4);
    			mount_component(songcontrol, div4, null);
    			append_dev(div4, t6);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			mount_component(btn0, div2, null);
    			append_dev(div15, t7);
    			append_dev(div15, div14);
    			append_dev(div14, div8);
    			append_dev(div8, div5);
    			if_blocks[current_block_type_index].m(div5, null);
    			append_dev(div8, t8);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div7, t10);
    			mount_component(nowplaying, div7, null);
    			append_dev(div14, t11);
    			append_dev(div14, div13);
    			append_dev(div13, div11);
    			append_dev(div11, div9);
    			append_dev(div11, t13);
    			append_dev(div11, div10);
    			mount_component(btn1, div10, null);
    			append_dev(div10, t14);
    			mount_component(btn2, div10, null);
    			append_dev(div13, t15);
    			append_dev(div13, table);
    			append_dev(table, colgroup);
    			append_dev(colgroup, col0);
    			append_dev(colgroup, t16);
    			append_dev(colgroup, col1);
    			append_dev(colgroup, t17);
    			append_dev(colgroup, col2);
    			append_dev(colgroup, t18);
    			append_dev(colgroup, col3);
    			append_dev(colgroup, t19);
    			append_dev(colgroup, col4);
    			append_dev(colgroup, t20);
    			append_dev(colgroup, col5);
    			append_dev(table, t21);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t23);
    			append_dev(tr, th1);
    			append_dev(tr, t25);
    			append_dev(tr, th2);
    			append_dev(tr, t27);
    			append_dev(tr, th3);
    			append_dev(tr, t29);
    			append_dev(tr, th4);
    			append_dev(tr, t31);
    			append_dev(tr, th5);
    			append_dev(div13, t33);
    			append_dev(div13, div12);
    			mount_component(playlisttable, div12, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
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
    				if_block2 = if_blocks[current_block_type_index];

    				if (!if_block2) {
    					if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block2.c();
    				} else {
    					if_block2.p(ctx, dirty);
    				}

    				transition_in(if_block2, 1);
    				if_block2.m(div5, null);
    			}

    			const btn1_changes = {};
    			if (dirty & /*$FLAG_YT_SEARCH_POPUP*/ 2) btn1_changes.onClick = /*func_1*/ ctx[7];
    			btn1.$set(btn1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toastcontainer.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(songcontrol.$$.fragment, local);
    			transition_in(btn0.$$.fragment, local);
    			transition_in(if_block2);
    			transition_in(nowplaying.$$.fragment, local);
    			transition_in(btn1.$$.fragment, local);
    			transition_in(btn2.$$.fragment, local);
    			transition_in(playlisttable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toastcontainer.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(songcontrol.$$.fragment, local);
    			transition_out(btn0.$$.fragment, local);
    			transition_out(if_block2);
    			transition_out(nowplaying.$$.fragment, local);
    			transition_out(btn1.$$.fragment, local);
    			transition_out(btn2.$$.fragment, local);
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
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div15);
    			destroy_component(songcontrol);
    			destroy_component(btn0);
    			if_blocks[current_block_type_index].d();
    			destroy_component(nowplaying);
    			destroy_component(btn1);
    			destroy_component(btn2);
    			destroy_component(playlisttable);
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
    	let $PLAYER_ELEMENT;
    	let $FLAG_PLAYING;
    	let $FLAG_LOADING_SCREEN_SAVER;
    	let $FLAG_YT_SEARCH_POPUP;
    	let $YT_VIDEO_ID;
    	let $LOCAL_SONG_PATH;
    	validate_store(PLAYER_ELEMENT, 'PLAYER_ELEMENT');
    	component_subscribe($$self, PLAYER_ELEMENT, $$value => $$invalidate(9, $PLAYER_ELEMENT = $$value));
    	validate_store(FLAG_PLAYING, 'FLAG_PLAYING');
    	component_subscribe($$self, FLAG_PLAYING, $$value => $$invalidate(10, $FLAG_PLAYING = $$value));
    	validate_store(FLAG_LOADING_SCREEN_SAVER, 'FLAG_LOADING_SCREEN_SAVER');
    	component_subscribe($$self, FLAG_LOADING_SCREEN_SAVER, $$value => $$invalidate(0, $FLAG_LOADING_SCREEN_SAVER = $$value));
    	validate_store(FLAG_YT_SEARCH_POPUP, 'FLAG_YT_SEARCH_POPUP');
    	component_subscribe($$self, FLAG_YT_SEARCH_POPUP, $$value => $$invalidate(1, $FLAG_YT_SEARCH_POPUP = $$value));
    	validate_store(YT_VIDEO_ID, 'YT_VIDEO_ID');
    	component_subscribe($$self, YT_VIDEO_ID, $$value => $$invalidate(2, $YT_VIDEO_ID = $$value));
    	validate_store(LOCAL_SONG_PATH, 'LOCAL_SONG_PATH');
    	component_subscribe($$self, LOCAL_SONG_PATH, $$value => $$invalidate(3, $LOCAL_SONG_PATH = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	window.addEventListener("beforeunload", event => {
    		event.preventDefault();
    		event.returnValue = "";
    	});

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
    		if (event.detail.data === -1) {
    			// not started
    			FLAG_PLAYER_IS_READY.set(false);
    		} else if (event.detail.data === 0) {
    			// end video
    			fowardSong($FLAG_PLAYING);
    		} else if (event.detail.data === 1) {
    			// is playing
    			FLAG_PLAYING.set(true);
    		} else if (event.detail.data === 2) {
    			// paused
    			FLAG_PLAYING.set(false);
    		} else if (event.detail.data === 5) {
    			// video on ready
    			if ($FLAG_PLAYING) $PLAYER_ELEMENT.playVideo();

    			FLAG_PLAYER_IS_READY.set(true);
    			FLAG_NEXT_SONG_LOADING.set(false);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const func = () => {
    		infoToast("현재 서비스 준비중입니다!");
    	};

    	const func_1 = () => {
    		FLAG_YT_SEARCH_POPUP.set(!$FLAG_YT_SEARCH_POPUP);
    	};

    	const func_2 = () => {
    		infoToast("현재 서비스 준비중입니다!");
    	};

    	$$self.$capture_state = () => ({
    		YtSearch: YTSearch,
    		YouTube: Src,
    		LoadingScreenSaver,
    		Btn,
    		SongControl,
    		PlayListTable,
    		NowPlaying,
    		ToastContainer,
    		FlatToast,
    		infoToast,
    		FLAG_YT_SEARCH_POPUP,
    		FLAG_LOADING_SCREEN_SAVER,
    		FLAG_PLAYER_IS_READY,
    		FLAG_PLAYING,
    		FLAG_NEXT_SONG_LOADING,
    		YT_VIDEO_ID,
    		LOCAL_SONG_PATH,
    		PLAYER_ELEMENT,
    		fowardSong,
    		onReadyYoutubePlayer,
    		onStateChangeYoutubePlayer,
    		$PLAYER_ELEMENT,
    		$FLAG_PLAYING,
    		$FLAG_LOADING_SCREEN_SAVER,
    		$FLAG_YT_SEARCH_POPUP,
    		$YT_VIDEO_ID,
    		$LOCAL_SONG_PATH
    	});

    	return [
    		$FLAG_LOADING_SCREEN_SAVER,
    		$FLAG_YT_SEARCH_POPUP,
    		$YT_VIDEO_ID,
    		$LOCAL_SONG_PATH,
    		onReadyYoutubePlayer,
    		onStateChangeYoutubePlayer,
    		func,
    		func_1,
    		func_2
    	];
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
