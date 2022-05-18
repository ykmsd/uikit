import { flipPosition, getCssVar, includes, isRtl, positionAt, toPx } from 'uikit-util';

export default {
    props: {
        pos: String,
        offset: null,
        flip: Boolean,
    },

    data: {
        pos: `bottom-${isRtl ? 'right' : 'left'}`,
        flip: true,
        offset: false,
    },

    connected() {
        this.pos = this.$props.pos.split('-').concat('center').slice(0, 2);
        this.axis = includes(['top', 'bottom'], this.pos[0]) ? 'y' : 'x';
    },

    methods: {
        positionAt(element, target, boundary) {
            const [dir, align] = this.pos;

            let offset = [this.getPositionOffset(element), this.getShiftOffset(element)];

            const attach = {
                element: [flipPosition(dir), align],
                target: [dir, align],
            };

            if (this.axis === 'y') {
                for (const prop in attach) {
                    attach[prop] = attach[prop].reverse();
                }
                offset = offset.reverse();
            }

            positionAt(element, target, {
                attach,
                offset,
                boundary,
                flip: this.flip,
                viewportOffset: this.getViewportOffset(element),
            });
        },

        getPositionOffset(element) {
            return (
                toPx(
                    this.offset === false ? getCssVar('position-offset', element) : this.offset,
                    this.axis === 'x' ? 'width' : 'height',
                    element
                ) * (includes(['left', 'top'], this.pos[0]) ? -1 : 1)
            );
        },

        getShiftOffset(element) {
            return includes(['center', 'justify'], this.pos[1])
                ? 0
                : toPx(
                      getCssVar('position-shift-offset', element),
                      this.axis === 'y' ? 'width' : 'height',
                      element
                  ) * (includes(['left', 'top'], this.pos[1]) ? 1 : -1);
        },

        getViewportOffset(element) {
            return toPx(getCssVar('position-viewport-offset', element));
        },
    },
};
