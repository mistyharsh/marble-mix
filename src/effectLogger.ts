
import { RouteEffect, RouteEffectGroup } from '@marblejs/core';

type RouteEffects = (RouteEffect | RouteEffectGroup)[]

export function printAPIEffects(effects: RouteEffects) {
    console.log(effects);
}