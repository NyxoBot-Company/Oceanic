"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const DefaultDispatchEvents = tslib_1.__importStar(require("./events"));
class Dispatcher {
    manager;
    events = new Map();
    constructor(manager) {
        Object.defineProperty(this, "manager", {
            value: manager,
            writable: false,
            enumerable: false,
            configurable: false,
        });
        const type = this.manager.options.dispatcher.blacklist === null
            ? "blacklist"
            : this.manager.options.dispatcher.whitelist === null
                ? "whitelist"
                : "none";
        for (const [event, fn] of Object.entries(DefaultDispatchEvents)) {
            if (type === "none" ||
                (type === "whitelist" &&
                    this.manager.options.dispatcher.whitelist?.includes(event)) ||
                (type === "blacklist" &&
                    !this.manager.options.dispatcher.blacklist?.includes(event))) {
                this.register(event, fn);
            }
        }
    }
    handle(data, shard) {
        const event = data.t;
        if (!this.events.has(event))
            return;
        const arr = this.events.get(event);
        for (const fn of arr)
            fn(data.d, shard);
    }
    register(event, fn, replace = false) {
        if (!this.events.has(event))
            this.events.set(event, []);
        const arr = this.events.get(event);
        if (replace && arr.length !== 0)
            arr.splice(0, arr.length);
        arr.push(fn);
    }
    unregister(event, fn) {
        if (!this.events.has(event))
            return;
        const arr = this.events.get(event);
        if (fn) {
            const index = arr.indexOf(fn);
            if (index !== -1)
                arr.splice(index, 1);
        }
        else
            arr.splice(0, arr.length);
    }
}
exports.default = Dispatcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlzcGF0Y2hlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9nYXRld2F5L0Rpc3BhdGNoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBR0Esd0VBQWtEO0FBV2xELE1BQXFCLFVBQVU7SUFDckIsT0FBTyxDQUFnQjtJQUMvQixNQUFNLEdBQWdELElBQUksR0FBRyxFQUFFLENBQUM7SUFDaEUsWUFBWSxPQUFxQjtRQUMvQixNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDckMsS0FBSyxFQUFFLE9BQU87WUFDZCxRQUFRLEVBQUUsS0FBSztZQUNmLFVBQVUsRUFBRSxLQUFLO1lBQ2pCLFlBQVksRUFBRSxLQUFLO1NBQ3BCLENBQUMsQ0FBQztRQUVILE1BQU0sSUFBSSxHQUNSLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEtBQUssSUFBSTtZQUNoRCxDQUFDLENBQUMsV0FBVztZQUNiLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsU0FBUyxLQUFLLElBQUk7Z0JBQ2xELENBQUMsQ0FBQyxXQUFXO2dCQUNiLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFFZixLQUFLLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FFN0QsRUFBRSxDQUFDO1lBQ0YsSUFDRSxJQUFJLEtBQUssTUFBTTtnQkFDZixDQUFDLElBQUksS0FBSyxXQUFXO29CQUNuQixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDN0QsQ0FBQyxJQUFJLEtBQUssV0FBVztvQkFDbkIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUM5RCxDQUFDO2dCQUNELElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzNCLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVPLE1BQU0sQ0FBQyxJQUF3QyxFQUFFLEtBQVk7UUFDbkUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQUUsT0FBTztRQUNwQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUUsQ0FBQztRQUNwQyxLQUFLLE1BQU0sRUFBRSxJQUFJLEdBQUc7WUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsUUFBUSxDQUNOLEtBQVEsRUFDUixFQUF1QixFQUN2QixPQUFPLEdBQUcsS0FBSztRQUVmLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7WUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDeEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFFLENBQUM7UUFDcEMsSUFBSSxPQUFPLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDO1lBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBVyxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUVELFVBQVUsQ0FDUixLQUFRLEVBQ1IsRUFBd0I7UUFFeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztZQUFFLE9BQU87UUFDcEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFFLENBQUM7UUFDcEMsSUFBSSxFQUFFLEVBQUUsQ0FBQztZQUNQLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBVyxDQUFDLENBQUM7WUFDdkMsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDO2dCQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLENBQUM7O1lBQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25DLENBQUM7Q0FDRjtBQTlERCw2QkE4REMifQ==