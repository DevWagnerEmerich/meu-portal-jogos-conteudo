/**
 * DragDropController — Handles all drag-and-drop + touch reordering
 *
 * OOP Paradigms:
 * - Encapsulation: private drag state
 * - Single Responsibility: only input/drag concerns
 * - Observer: emits events via EventBus instead of calling logic directly
 *
 * FIX: Uses in-place DOM swap instead of full re-render to prevent
 * drag state loss. Only emits 'drag:swapDone' after mouse/touch release.
 */
import EventBus from '../core/EventBus.js';

class DragDropController {
    #srcIdx = null;
    #srcEl = null;
    #touchSrcIdx = null;
    #ghost = null;
    #offX = 0;
    #offY = 0;
    #container = null;

    attach(container) {
        this.#container = container;
    }

    detach() {
        this.#cleanupGhost();
        this.#container = null;
        this.#srcIdx = null;
        this.#srcEl = null;
    }

    /**
     * Bind drag events to a code card.
     * @param {HTMLElement} el
     * @param {number} idx
     */
    bindCard(el, idx) {
        el.draggable = true;
        el.dataset.idx = idx;

        // ── Desktop Drag ──────────────────────────────────────
        el.addEventListener('dragstart', e => {
            this.#srcIdx = +el.dataset.idx;
            this.#srcEl = el;
            el.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            // Use setTimeout so the browser captures drag image before class changes
            setTimeout(() => el.style.opacity = '0.25', 0);
        });

        el.addEventListener('dragover', e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        el.addEventListener('dragenter', e => {
            e.preventDefault();
            const destIdx = +el.dataset.idx;
            if (this.#srcIdx !== null && destIdx !== this.#srcIdx) {
                el.classList.add('drag-over');
                // Live visual swap (DOM only — no state emit yet)
                this.#domSwap(this.#srcIdx, destIdx);
                this.#srcIdx = destIdx; // update srcIdx to follow the dragged card
            }
        });

        el.addEventListener('dragleave', () => {
            el.classList.remove('drag-over');
        });

        el.addEventListener('drop', e => {
            e.preventDefault();
            el.classList.remove('drag-over');
        });

        el.addEventListener('dragend', () => {
            el.classList.remove('dragging');
            el.style.opacity = '';
            this.#container?.querySelectorAll('.code-card').forEach(c => {
                c.classList.remove('drag-over');
                c.style.opacity = '';
            });
            // Emit final order from DOM
            this.#emitFinalOrder();
            this.#srcIdx = null;
            this.#srcEl = null;
        });

        // ── Mobile Touch ──────────────────────────────────────
        el.addEventListener('touchstart', e => {
            const t = e.touches[0];
            this.#touchSrcIdx = +el.dataset.idx;
            const r = el.getBoundingClientRect();
            this.#offX = t.clientX - r.left;
            this.#offY = t.clientY - r.top;

            this.#ghost = el.cloneNode(true);
            Object.assign(this.#ghost.style, {
                position: 'fixed',
                zIndex: '9999',
                width: r.width + 'px',
                pointerEvents: 'none',
                opacity: '0.9',
                left: (t.clientX - this.#offX) + 'px',
                top: (t.clientY - this.#offY) + 'px',
                margin: '0',
                transform: 'scale(1.04)',
                transition: 'none',
                borderRadius: '14px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            });
            document.body.appendChild(this.#ghost);
            el.style.opacity = '0.2';
        }, { passive: true });

        el.addEventListener('touchmove', e => {
            e.preventDefault();
            const t = e.touches[0];
            if (this.#ghost) {
                this.#ghost.style.left = (t.clientX - this.#offX) + 'px';
                this.#ghost.style.top = (t.clientY - this.#offY) + 'px';
            }
            // Highlight the card we're hovering over
            this.#container?.querySelectorAll('.code-card').forEach(c => c.classList.remove('drag-over'));
            const under = document.elementFromPoint(t.clientX, t.clientY)?.closest('.code-card');
            if (under && +under.dataset.idx !== this.#touchSrcIdx) {
                under.classList.add('drag-over');
            }
        }, { passive: false });

        el.addEventListener('touchend', e => {
            this.#cleanupGhost();
            const t = e.changedTouches[0];
            const under = document.elementFromPoint(t.clientX, t.clientY)?.closest('.code-card');

            this.#container?.querySelectorAll('.code-card').forEach(c => {
                c.classList.remove('drag-over');
                c.style.opacity = '';
            });

            if (under) {
                const destIdx = +under.dataset.idx;
                if (this.#touchSrcIdx !== null && this.#touchSrcIdx !== destIdx) {
                    this.#domSwap(this.#touchSrcIdx, destIdx);
                    this.#emitFinalOrder();
                }
            }
            this.#touchSrcIdx = null;
        });
    }

    // ── Private helpers ─────────────────────────────────────────

    /**
     * Swap two cards in the DOM by their current data-idx attribute.
     * Updates data-idx attributes but does NOT re-render.
     */
    #domSwap(fromIdx, toIdx) {
        if (!this.#container) return;
        const cards = [...this.#container.querySelectorAll('.code-card')];
        const a = cards.find(c => +c.dataset.idx === fromIdx);
        const b = cards.find(c => +c.dataset.idx === toIdx);
        if (!a || !b) return;

        // Swap data-idx
        a.dataset.idx = toIdx;
        b.dataset.idx = fromIdx;

        // Also swap line number display
        const alnEl = a.querySelector('.cc-linenum');
        const blnEl = b.querySelector('.cc-linenum');
        if (alnEl && blnEl) {
            const tmp = alnEl.textContent;
            alnEl.textContent = blnEl.textContent;
            blnEl.textContent = tmp;
        }

        // Physical DOM swap using insertBefore
        const aParent = a.parentNode;
        const bParent = b.parentNode;
        const aNext = a.nextSibling;

        if (aNext === b) {
            // a comes immediately before b
            aParent.insertBefore(b, a);
        } else {
            const bNext = b.nextSibling;
            aParent.insertBefore(b, aNext);
            bParent.insertBefore(a, bNext);
        }
    }

    /**
     * Read current DOM order and emit to StateManager.
     */
    #emitFinalOrder() {
        if (!this.#container) return;
        // Get cards sorted by their visual position (querySelectorAll returns DOM order)
        const cards = [...this.#container.querySelectorAll('.code-card')];
        // We stored the original LineId in data-lineid during bindCard
        const order = cards.map(c => c.dataset.lineid).filter(Boolean);
        if (order.length > 0) {
            EventBus.emit('drag:orderChanged', { order });
        }
    }

    #cleanupGhost() {
        if (this.#ghost) { this.#ghost.remove(); this.#ghost = null; }
    }
}

export default new DragDropController();
