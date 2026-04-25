"""Run the arm through a sequence of test poses using inverse kinematics.

Examples:
    python multi_pose_test.py
    python multi_pose_test.py --live
    python multi_pose_test.py --delay 2.0 --live
"""

from __future__ import annotations

import argparse
import time
from dataclasses import replace

from config import CONFIG
from control import RobotController
from kinematics import KinematicsError, Pose, inverse_kinematics


DEFAULT_POSES = [
    ("center-high", Pose(x_mm=90.0, y_mm=0.0, z_mm=150.0, tool_angle_deg=-90.0)),
    ("center-mid", Pose(x_mm=90.0, y_mm=0.0, z_mm=120.0, tool_angle_deg=-90.0)),
    ("left-hover", Pose(x_mm=85.0, y_mm=30.0, z_mm=120.0, tool_angle_deg=-90.0)),
    ("right-hover", Pose(x_mm=85.0, y_mm=-30.0, z_mm=120.0, tool_angle_deg=-90.0)),
    ("forward-low", Pose(x_mm=120.0, y_mm=0.0, z_mm=105.0, tool_angle_deg=-90.0)),
    ("retract", Pose(x_mm=70.0, y_mm=0.0, z_mm=165.0, tool_angle_deg=-90.0)),
]


def build_hardware(dry_run: bool):
    return replace(CONFIG.hardware, dry_run=dry_run)


def run_pose_sequence(dry_run: bool, elbow_up: bool, delay_s: float) -> None:
    hardware = build_hardware(dry_run)

    with RobotController(hardware=hardware, paint=CONFIG.paint) as robot:
        for name, pose in DEFAULT_POSES:
            print(f"\nMoving to pose '{name}': {pose}")
            try:
                angles = inverse_kinematics(pose, CONFIG.robot, elbow_up=elbow_up)
            except KinematicsError as exc:
                print(f"Skipping '{name}': {exc}")
                continue

            print(f"Calculated joint angles: {angles}")
            robot.move_servos(angles.as_servo_dict(), delay_s=1.0)
            time.sleep(delay_s)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run a fixed sequence of IK test poses.")
    parser.add_argument(
        "--delay",
        type=float,
        default=1.5,
        help="Extra delay in seconds to wait after each pose.",
    )
    parser.add_argument(
        "--elbow-down",
        action="store_true",
        help="Use the elbow-down IK branch instead of the default elbow-up branch.",
    )
    parser.add_argument(
        "--live",
        action="store_true",
        help="Actually drive the PCA9685. Without this flag the script stays in dry-run mode.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    run_pose_sequence(
        dry_run=not args.live,
        elbow_up=not args.elbow_down,
        delay_s=args.delay,
    )


if __name__ == "__main__":
    main()
